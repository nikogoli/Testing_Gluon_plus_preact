/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import * as Gluon from '../gluon_src/index.js'
import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import App from "./App.tsx"


// ------ settings ----------
import { VIEW_CONFIG } from "./settings.ts" // 別ファイルで作成する
// web worker から settings の内容を読み込む必要があるが、
// worker.ts の中で ' import { VIEW_CONFIG } from "./main.tsx" 'とすると
// port の重複によってエラーになる


// ------- Set Web worker ----------
const _worker = new Worker(
  join(dirname(import.meta.url), "worker.tsx"),
  { type: "module" },
)



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



// ------ Create html and save its path for worker ------
const html = renderToString(View())
const tempFilePath = await Deno.makeTempFile({suffix: ".html"})
await Deno.writeTextFile(tempFilePath, html)

Deno.env.set("ToppageFilePath", tempFilePath)


// ------- Start Gluon with url ---------
const _Browser = await Gluon.open(`http://localhost:${VIEW_CONFIG.PORT}/`,
  {
    windowSize: VIEW_CONFIG.SIZE,
    forceBrowser: null,
    onLoad: () => {}
  }
)

//worker.terminate()