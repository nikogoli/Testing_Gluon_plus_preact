/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import * as Gluon from '../src/index.js'



//const Browser = await Gluon.open("https://www.notion.so/login", {
const Browser = await Gluon.open("https://zenn.dev/scraps/new", {
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