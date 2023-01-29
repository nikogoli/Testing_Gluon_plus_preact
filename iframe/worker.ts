import { serve } from "https://deno.land/std@0.155.0/http/server.ts"
import { setHTML } from "./setHTML.ts"
import { VIEW_CONFIG } from "./mod.ts"


const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}




const PTRN_idx = new URLPattern({ pathname: '/index/:title' })


const server = serve( async (req) => {  
  console.log(`[worker] called with: ${req.url}`)
  if (req.url == `http://localhost:${VIEW_CONFIG.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  else if (req.url == "http://localhost:8088/enter?redirect_to=%2F"){
    return new Response("", {headers:{location:"https://zenn.dev/enter?redirect_to=%2F"}, status: 301})
  }
  const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/pain`})
  return new Response("", {headers, status: 404})
}, { port: VIEW_CONFIG.PORT })

await server