import { serve } from "https://deno.land/std@0.155.0/http/server.ts"
import { setHTML } from "./setHTML.ts"
import { VIEW_CONFIG } from "./mod.ts"
import { TextInfo } from "./types.ts"


const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}

const Text_Info:TextInfo  = await Deno.readTextFile("./static/sango_shu/info.json").then(tx => JSON.parse(tx))


const PTRN_idx = new URLPattern({ pathname: '/index/:title' })


const server = serve( async (req) => {  
  console.log(`[worker] called with: ${req.url}`)
  if (req.url == `http://localhost:${VIEW_CONFIG.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  else if (PTRN_idx.test(req.url)){
    const title = PTRN_idx.exec(req.url)!.pathname.groups["title"]
    const data = Text_Info.texts_data.find(d => d.title == decodeURI(title))
    if (data){
      const { html } = await setHTML({type: "page", data})
      const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
      return new Response(html, {headers, status: 200})
    } else {
      const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/pain`})
      return new Response("", {headers, status: 404, statusText: "No match for queryed title"})
    }
  }
  const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/pain`})
  return new Response("", {headers, status: 404})
}, { port: VIEW_CONFIG.PORT })

await server