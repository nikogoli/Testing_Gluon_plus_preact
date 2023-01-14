import * as Gluon from '../src/index.js'
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import { setHTML } from "./setHTML.ts"
import { VIEW_CONFIG } from "./mod.ts"
import { TextInfo } from './types.ts'

// Settings are at ./mod.ts

// ------- Web Worker ----------

const worker = new Worker(
  join(dirname(import.meta.url), "worker.ts"),
  { type: "module" },
)

// ----------------------------

const titles_data  = await Deno.readTextFile("./static/sango_shu/info.json")
    .then(tx => JSON.parse(tx))
    .then((jdata:TextInfo) => jdata.texts_data.map(d => {return { title: d.title, author: d.author }}))

const { file_path } = await setHTML({type: "home", data:{titles_data}})

Deno.env.set("ToppageFilePath", file_path)


//const Browser = await Gluon.open(file_path, {
const Browser = await Gluon.open(`http://localhost:${VIEW_CONFIG.PORT}/`, {
  windowSize: VIEW_CONFIG.SIZE,
  forceBrowser: null,
  onLoad: () => {
    setTimeout(() => {
      document.title = "Deno App with Gluon"
      Object.defineProperty(document, 'title', { get() {}, set() {} })
    }, 1000)
  }
})

//worker.terminate()