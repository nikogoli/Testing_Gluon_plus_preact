/** @jsx h */
import { h, JSX, Fragment } from "https://esm.sh/preact@10.10.6"

import { win32, resolve } from "https://deno.land/std@0.172.0/path/mod.ts"
import { walk } from "https://deno.land/std@0.155.0/fs/mod.ts"
import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"

import { SetViewProps } from "../types.ts"
import { VIEW_CONFIG } from "../settings.ts"


type RouteMod = {
  default: (arg:any)=>JSX.Element,
  PropsSetter: undefined |( () => Record<string, unknown>)
}


async function route_files_to_dict(dict: Record<string, string>){
  const file_iteratior = walk("./routes",
  { maxDepth: 1, match: [/\.tsx$/, /\.jsx$/] }
  )
  for await (const fl of file_iteratior){
    dict[fl.name] = fl.path.replaceAll("\\", "/")
  }
  return dict
}


export async function setHTML(props: SetViewProps){

  // ------ Get route files ----------
  let Name2Path_dict: Record<string, string>
  if (Deno.env.get("RoutesDict")){
    Name2Path_dict = JSON.parse(Deno.env.get("RoutesDict")!) as Record<string, string>
  } else {
    Name2Path_dict = await route_files_to_dict({})
    Deno.env.set("RoutesDict", JSON.stringify(Name2Path_dict))
  }

  const raw_name = props.route.split(".")[0]
  const mod_name = raw_name.charAt(0).toUpperCase() + raw_name.slice(1)
  const path = Name2Path_dict[props.route]
  const MOD = await import(String(win32.toFileUrl(resolve(`./${path}`)))) as RouteMod

  const { PropsSetter } = MOD
  let comp_props : null | Record<string, unknown> = null
  if (props.props_setter){
    comp_props = (props.props_setter.constructor.name === 'AsyncFunction')
        ? await props.props_setter()
        : props.props_setter() as Record<string, unknown>
  }
  else if (PropsSetter) {
    comp_props = (PropsSetter.constructor.name === 'AsyncFunction')
        ? await PropsSetter()
        : PropsSetter()
  }

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
    const { GOOGLE_FONTS, TW_CONFIG } = VIEW_CONFIG
    const fontlink = (GOOGLE_FONTS)
      ? GOOGLE_FONTS.reduce((txt, f) => txt+`family=${f.replaceAll(" ", "+")}&`, "https://fonts.googleapis.com/css2?") + "display=swap"
      : null

    const props = comp_props ? comp_props : {}
  
    return(
      <html>
        <head>
            <meta charSet="utf-8"/>
            <title>{VIEW_CONFIG.TITLE}</title>
            { (GOOGLE_FONTS && fontlink)
              ? <link href={fontlink} rel="stylesheet"></link>
              : <Fragment></Fragment>
            }
            <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
            { (TW_CONFIG)
              ? <script type="twind-config" dangerouslySetInnerHTML={{__html: JSON.stringify(TW_CONFIG)}}></script>
              : <Fragment></Fragment>
            }
            <script type="module" dangerouslySetInnerHTML={{__html: script}}></script>
            <style> {`button:focus { outline-style: none !important}`} </style>
        </head>
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