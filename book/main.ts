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

const text_info:TextInfo = await Deno.readTextFile("./static/sango_shu/info.json")
    .then(tx => JSON.parse(tx))
const { texts_data, ...book_info } = text_info
const titles_data = texts_data.map(d => {return { title: d.title, author: d.author }})

const { file_path } = await setHTML({type: "home", data:{titles_data, book_info}})

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