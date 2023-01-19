/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { serve } from "https://deno.land/std@0.155.0/http/server.ts"
import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"

import Page from "./Page.tsx"
import { VIEW_CONFIG } from "./settings.ts"

const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}


const PTRN_page = new URLPattern({ pathname: '/page/:idx' })


const server = serve( async (req) => {  
  console.log(`[worker] called with: ${req.url}`)

  if (req.url == `http://localhost:${VIEW_CONFIG.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  else if (PTRN_page.test(req.url)){
    const idx = Number(PTRN_page.exec(req.url)!.pathname.groups["idx"])
    const title = `ページその ${idx}`
    const text = `このページは ${idx}番目のページです。`


    // ------ Bundle -------    
    const CLIENT_TS =`
      /** @jsx h */
      import { h, hydrate } from "https://esm.sh/preact@10.10.6"
      import Page from "./Page.tsx"
      hydrate( <Page {...${JSON.stringify({title, text, idx})}} />, document.body )
    `

    await Deno.writeTextFile(VIEW_CONFIG.CRIENT_PATH, CLIENT_TS)

    const script = await bundle(VIEW_CONFIG.CRIENT_PATH, {allowRemote:true, compilerOptions:{jsxFactory:"preact.h"}}).then(result => result.code)

    await Deno.remove(VIEW_CONFIG.CRIENT_PATH)

    // ------ Define root component ------
    const View = () => {  
      return(
        <html>
          <head>
              <meta charSet="utf-8"/>
              <title>{VIEW_CONFIG.TITLE}</title>
              <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
              <script type="module" dangerouslySetInnerHTML={{__html: script}}></script>
              <style> {`button:focus { outline-style: none !important}`} </style>
          </head>
          <body>
            <Page {...{title, text, idx}} />
          </body>
        </html>
      )
    }

    // ------ Create html and respond ------
    const html = renderToString(View())    
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})    
  }
  
  const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/pain`})
  return new Response("", {headers, status: 404})
}, { port: VIEW_CONFIG.PORT })

await server