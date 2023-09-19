import * as Gluon from '../../gluon_src/index.js'
import { renderToString } from "preact-render-to-string"

import { toFileUrl, resolve } from "https://deno.land/std@0.200.0/path/mod.ts"
import * as esbuild from "https://deno.land/x/esbuild@v0.15.10/mod.js"
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts"

import App from "./App.tsx"


// ------ settings ----------
const VIEW_CONFIG = {
  TITLE: "Deno App with Gluon",
  SIZE: [600, 400],
  CRIENT_PATH: "./tempClient.tsx"
}
const importMapURL = await Deno.readTextFile("deno.json")
    .then(tx => JSON.parse(tx) as Record<string, string>)
    .then(jdata => toFileUrl(resolve(jdata.importMap)))



// ------ Bundle -------
const CLIENT_TS =`\
  import { hydrate } from "https://esm.sh/preact@10.10.6"
  import App from "./App.tsx"
  hydrate( <App />, document.body )
`

await Deno.writeTextFile(VIEW_CONFIG.CRIENT_PATH, CLIENT_TS)

esbuild.initialize({})
const script = await esbuild.build({
  plugins: [denoPlugin({importMapURL})],
  entryPoints: {main: toFileUrl(resolve(VIEW_CONFIG.CRIENT_PATH)).href},
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile: "bundled.js",
  jsx: "automatic",
  jsxImportSource: "preact",
}).then(_result => Deno.readTextFile("./bundled.js"))
esbuild.stop()

await Deno.remove(VIEW_CONFIG.CRIENT_PATH)
await Deno.remove("./bundled.js")


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