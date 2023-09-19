import { serve } from "./utils/router.ts"
import { setHTML } from "./utils/setHTML.tsx"
import { contentType } from "https://deno.land/std@0.200.0/media_types/mod.ts"
import { VIEW_CONFIG } from "./settings.ts"

const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}


const PAGE_PATHS: Array<string> = []
for (const fl of Deno.readDirSync("./static/pagedata")){
  PAGE_PATHS.push(`./static/pagedata/${fl.name}`)
}
const MAX_LEN = PAGE_PATHS.length


serve({ 
  "/": async (_req) => {
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("text/html")})
    return new Response(html, {headers, status: 200})
  },


  "/page/:page_idx": async (_req, params) => {
    const page_idx = Number(params!["page_idx"]!)
    const path = PAGE_PATHS.at(page_idx-1)!
    const title = path.split("/").at(-1)!.split(".")[0]
    const text = await Deno.readTextFile(path)

    const { html } = await setHTML({
      route: "page.tsx",
      save_file: false,
      props_setter: () => {return { info: {title, text, page_idx}, max_len: MAX_LEN }},
      import_map_url: Deno.env.get("import_map_url")
    })
    const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("html")})
    return new Response(html, {headers, status: 200})
  },


  404: (_req) => {
    const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("text/plain")})
    return new Response("", {headers, status: 404})
  }

}, { port: VIEW_CONFIG.PORT })