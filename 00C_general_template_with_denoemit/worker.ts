import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts"
import { contentType } from "https://deno.land/std@0.177.0/media_types/mod.ts"
import { blue, green, yellow } from "https://deno.land/std@0.177.0/fmt/colors.ts"

import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"
const View_Config = (VIEW_CONFIG.USE_WORKER) ? VIEW_CONFIG : {...VIEW_CONFIG, PORT:8088}

const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}


const log_url = (req:Request, str?:string) => console.log(`[${blue("worker")}] called with: ${green(req.url)}`, str ?? "")
const response404 = (req:Request) => {
  log_url(req, yellow("404"))
  const headers = new Headers({...HEADER_OPTION, "Content-Type":contentType("text/plain")})
  return new Response("", {headers, status: 404})
}

serve({
  "/": async (req) => {
    if (Deno.env.get("ToppageFilePath")){
      log_url(req)
      const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
      const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
      return new Response(html, {headers, status: 200})
    } else {
      return response404(req)
    }
  },

  "/page/:idx": async (req, _conn, param) => {
    if (param){
      log_url(req)
      const PropsSetter = () => {
        const idx = Number(param.idx)
        const title = `ページその ${idx}`
        const text = `このページは ${idx}番目のページです。`
        return { title, text, idx }
      }

      const { html } = await setHTML({
        route: "page.tsx",
        save_file: false,
        props_setter: PropsSetter
      })
      const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
      return new Response(html, {headers, status: 200})
    } else {
      return response404(req)
    }
  },

  404: (req) => { return response404(req) }},
{ port: View_Config.PORT })