import * as Gluon from '../src/index.js'
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import { setHTML } from "./setHTML.ts"
import { VIEW_CONFIG } from "./mod.ts"


// ------- Web Worker ----------
const worker = new Worker(
  join(dirname(import.meta.url), "worker.ts"),
  { type: "module" },
)

const { file_path } = await setHTML({type: "home", url:"https://www.notion.so/login"})
Deno.env.set("ToppageFilePath", file_path)

//const Browser = await Gluon.open("https://www.notion.so/login", {
const Browser = await Gluon.open(`https://www.notion.so/login`, {
  windowSize: [900,700],
  forceBrowser: null,
  onLoad: () => {
    setTimeout(() => {
      document.title = "Deno App with Gluon"
      Object.defineProperty(document, 'title', { get() {}, set() {} })
      //document.querySelector<HTMLElement>(".notion-app-inner.notion-light-theme")!.style.fontFamily = "'Zen Maru Gothic'"
      document.body.style.fontFamily = "'Zen Maru Gothic'!important"
    }, 1000)
  }
})