/** @jsx h */
import { h, JSX, Fragment } from "https://esm.sh/preact@10.10.6"
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"

import { toFileUrl, resolve } from "https://deno.land/std@0.200.0/path/mod.ts"

import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"

import { SetViewProps } from "../types.ts"
import { VIEW_CONFIG } from "../settings.ts"
import { HeaderHTML } from "./HeaderHTML.tsx"


type RouteMod = {
  default: (props:Record<string, unknown>) => JSX.Element,
  PropsSetter?: ( () => Record<string, unknown>) | ( () => Promise<Record<string, unknown>>)
}


async function route_files_to_dict(){
  const dict: Record<string, string> = {}
  for await (const fl of Deno.readDir("./routes")){
    if (fl.name.endsWith(".tsx") || fl.name.endsWith(".jsx")){
      dict[fl.name] = `./routes/${fl.name}`
    }
  }
  return dict
}


export async function setHTML(props: SetViewProps){

  // ------ Get route files ----------
  let Name2Path_dict: Record<string, string>
  if (Deno.env.get("RoutesDict")){
    Name2Path_dict = JSON.parse(Deno.env.get("RoutesDict")!) as Record<string, string>
  } else {
    Name2Path_dict = await route_files_to_dict()
    Deno.env.set("RoutesDict", JSON.stringify(Name2Path_dict))
  }

  const raw_name = props.route.split(".")[0]
  const mod_name = raw_name.charAt(0).toUpperCase() + raw_name.slice(1)

  const path = Name2Path_dict[props.route]
  const MOD = await import(toFileUrl(resolve(`./${path}`)).href) as RouteMod

  const comp_props = (props.props_setter)
      ? await props.props_setter()
      : (MOD.PropsSetter) ? await MOD.PropsSetter()
      : null

  const CLIENT_TS =`
    /** @jsx h */
    import { h, hydrate } from "https://esm.sh/preact@10.10.6"
    import { default as ${mod_name} } from "./${path}"
    hydrate( <${mod_name} ${comp_props ? `{...${JSON.stringify(comp_props)}}` : ""} />, document.body )
  `
  
  await Deno.writeTextFile(VIEW_CONFIG.CRIENT_PATH, CLIENT_TS)

  const script = await bundle(VIEW_CONFIG.CRIENT_PATH, {allowRemote:true, compilerOptions:{jsxFactory:"preact.h"}}).then(result => result.code)
  await Deno.remove(VIEW_CONFIG.CRIENT_PATH)

  const ActiveComp = MOD.default

  function View(){  
    const { GOOGLE_FONTS } = VIEW_CONFIG
    const props = comp_props ? comp_props : {}
  
    return(
      <html>
        <HeaderHTML script={script}/>
        <body>
          <ActiveComp {...props}/>
          { (GOOGLE_FONTS)
            ? <style> {`body { font-family: \'${GOOGLE_FONTS[0]}\'}`} </style>
            : <Fragment></Fragment>
          }
        </body>
      </html>
    )
  }


  const html = renderToString(View())
  if (props.save_file){
    const tempFilePath = await Deno.makeTempFile({suffix: ".html"})
    await Deno.writeTextFile(tempFilePath, html)
    return { file_path: tempFilePath, html}
  } else {
    return { file_path: "", html }
  }
}