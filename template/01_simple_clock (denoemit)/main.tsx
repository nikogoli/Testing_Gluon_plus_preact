/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import * as Gluon from '../../gluon_src/index.js'
import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"

import App from "./App.tsx"


// ------ settings ----------
const VIEW_CONFIG = {
  TITLE: "Deno App with Gluon",
  SIZE: [600, 400],
  CRIENT_PATH: "./tempClient.tsx"
}



// ------ Bundle -------
const CLIENT_TS =`
  /** @jsx h */
  import { h, hydrate } from "https://esm.sh/preact@10.10.6"
  import App from "./App.tsx"
  hydrate( <App />, document.body )
`

await Deno.writeTextFile(VIEW_CONFIG.CRIENT_PATH, CLIENT_TS)

const script = await bundle(VIEW_CONFIG.CRIENT_PATH, {allowRemote:true, compilerOptions:{jsxFactory:"preact.h"}}).then(result => result.code)

await Deno.remove(VIEW_CONFIG.CRIENT_PATH)



// ------ Define root component ------
function View(){  
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
        <App />
      </body>
    </html>
  )
}



// ------ Create html ------
const html = renderToString(View())
const tempFilePath = await Deno.makeTempFile({suffix: ".html"})
await Deno.writeTextFile(tempFilePath, html)



// ------- Start Gluon with file ---------
const _Browser = await Gluon.open(tempFilePath,
  {
    windowSize: VIEW_CONFIG.SIZE,
    forceBrowser: null,
    onLoad: () => {}
  }
)

//worker.terminate()