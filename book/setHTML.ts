import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"

import View from "./routes/View.tsx"
import { setViewProps } from "./types.ts"
import { VIEW_CONFIG } from "./mod.ts"

export async function setHTML(props: setViewProps){
  const { type } = props
  const CLIENT_TS = (type == "home") ?
  `
    /** @jsx h */
    import { h, hydrate } from "https://esm.sh/preact@10.10.6"
    import Home from "./routes/Home.tsx"
    hydrate( <Home {...${JSON.stringify(props.data)}}/>, document.body )
  `
  :
  `
    /** @jsx h */
    import { h, hydrate } from "https://esm.sh/preact@10.10.6"
    import Page from "./routes/Page.tsx"
    hydrate( <Page {...${JSON.stringify(props.data)}}/>, document.body )
  `
  await Deno.writeTextFile(VIEW_CONFIG.CRIENT_PATH, CLIENT_TS)

  const script = await bundle(VIEW_CONFIG.CRIENT_PATH, {allowRemote:true, compilerOptions:{jsxFactory:"preact.h"}}).then(result => result.code)
  await Deno.remove(VIEW_CONFIG.CRIENT_PATH)

  const html = renderToString(View({...props, script}))
  if (type == "home"){
    const tempFilePath = await Deno.makeTempFile({suffix: ".html"})
    await Deno.writeTextFile(tempFilePath, html)
    return { file_path: tempFilePath, html}
  } else {
    return { file_path: "", html }
  }
}