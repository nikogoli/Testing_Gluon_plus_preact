import { serve } from "./utils/router.ts"
import { contentType } from "https://deno.land/std@0.177.0/media_types/mod.ts"

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


serve({ 
  "/": async (_req) => {
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("text/html")})
    return new Response(html, {headers, status: 200})
  },


  "/page/:idx": async (_req, params) => {
    const idx = Number(params!["idx"]!)
    const path = PAGE_PATHS.at(idx-1)!
    const title = path.split("/").at(-1)!.split(".")[0]
    const text = await Deno.readTextFile(path)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("application/json")})
    return new Response(JSON.stringify({title, text}), {headers, status: 200})
  },


  404: (_req) => {
    const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("text/plain")})
    return new Response("", {headers, status: 404})
  }

}, { port: VIEW_CONFIG.PORT ?? 8000 })