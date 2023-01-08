/** @jsxRuntime classic */
/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import * as Gluon from '../src/index.js'
import { renderToString } from "https://esm.sh/preact-render-to-string@5.2.2"
import { bundle } from "https://deno.land/x/emit@0.9.0/mod.ts"
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import {Config} from "../twind.config.js"
import App from "./App.tsx"



// ---------- Settings ---------
const CRIENT_PATH = "./Client.tsx"     // path to the preact file for hydration
const SIZE = [900, 600]

const GoogleFonts = [
  "Zen Maru Gothic",
  "Yusei Magic",
]


// ----------------------------
const script = await bundle(CRIENT_PATH, {allowRemote:true, compilerOptions:{jsxFactory:"preact.h"}}).then(result => result.code)

const fontlink = (GoogleFonts.length > 0)
  ? GoogleFonts.reduce((txt, f) => txt+`family=${f.replaceAll(" ", "+")}&`, "https://fonts.googleapis.com/css2?") + "display=swap"
  : ""


function View(){
  return(
    <html>
      <head>
        <meta charSet="utf-8"/>
        <link href={fontlink} rel="stylesheet"></link>
        <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
        <script type="twind-config" dangerouslySetInnerHTML={{__html: JSON.stringify(Config)}}></script>
        <script type="module" dangerouslySetInnerHTML={{__html: script}}></script>
      </head>
      <body>
        <App />
        <style> {`body { font-family: \'${GoogleFonts[0]}\'}`} </style>
      </body>
    </html>
  )
}

const tempFilePath = await Deno.makeTempFile({suffix: ".html"})
await Deno.writeTextFile(tempFilePath, renderToString(View()));


const worker = new Worker(
  join(dirname(import.meta.url), "worker.ts"),
  { type: "module" },
)

const Browser = await Gluon.open(tempFilePath, {
  windowSize: SIZE,
  forceBrowser: null,
  onLoad: () => {
    setTimeout(() => {
      document.title = "Deno App with Gluon"
      Object.defineProperty(document, 'title', { get() {}, set() {} })
    }, 1000)
  }
})

//worker.terminate()