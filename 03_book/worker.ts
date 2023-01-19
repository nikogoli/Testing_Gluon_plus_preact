import { serve } from "https://deno.land/std@0.155.0/http/server.ts"

import { PageProps, TextInfo } from "./types.ts"
import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"
const View_Config = (VIEW_CONFIG.USE_WORKER) ? VIEW_CONFIG : {...VIEW_CONFIG, PORT:8088}

const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}


const Text_Info:TextInfo  = await Deno.readTextFile("./static/sango_shu/info.json").then(tx => JSON.parse(tx))


const PTRN_idx = new URLPattern({ pathname: '/index/:title' })

const server = serve( async (req) => {  
  console.log(`[worker] called with: ${req.url}`)
  if (req.url == `http://localhost:${View_Config.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  else if (PTRN_idx.test(req.url)){
    const Handler: ()=>PageProps = () => {
      const title = PTRN_idx.exec(req.url)!.pathname.groups["title"]
      const data = Text_Info.texts_data.find(d => d.title == decodeURI(title))
      return data ?? { title: null }
    }

    const { html } = await setHTML({
      route: "Page.tsx",
      save_file: false,
      handler: Handler
    })
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})    
  }
  const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/pain`})
  return new Response("", {headers, status: 404})
}, { port: View_Config.PORT })

await server