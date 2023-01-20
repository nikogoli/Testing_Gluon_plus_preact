import { serve } from "https://deno.land/std@0.155.0/http/server.ts"

import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"
const View_Config = (VIEW_CONFIG.USE_WORKER) ? VIEW_CONFIG : {...VIEW_CONFIG, PORT:8088}

const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}



const PTRN_page = new URLPattern({ pathname: '/page/:idx' })

const server = serve( async (req) => {  
  console.log(`[worker] called with: ${req.url}`)

  if (req.url == `http://localhost:${View_Config.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  
  else if (PTRN_page.test(req.url)){

    const Handler = () => {
      const idx = Number(PTRN_page.exec(req.url)!.pathname.groups["idx"])
      const title = `ページその ${idx}`
      const text = `このページは ${idx}番目のページです。`
      return { title, text, idx }
    }

    const { html } = await setHTML({
      route: "page.tsx",
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