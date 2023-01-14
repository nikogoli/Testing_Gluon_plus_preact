/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import Home from "./Home.tsx"
import Page from "./Page.tsx"
import { setViewProps } from "../types.ts"
import { VIEW_CONFIG  } from "../mod.ts"

export default function View(props: setViewProps & {script: string}){
  const { type, script } = props
  const { GoogleFonts, TW_CONFIG } = VIEW_CONFIG
  const fontlink = GoogleFonts.reduce((txt, f) => txt+`family=${f.replaceAll(" ", "+")}&`, "https://fonts.googleapis.com/css2?") + "display=swap"

  return(
    <html>
      <head>
          <meta charSet="utf-8"/>
          <link href={fontlink} rel="stylesheet"></link>
          <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
          <script type="twind-config" dangerouslySetInnerHTML={{__html: JSON.stringify(TW_CONFIG)}}></script>
          <script type="module" dangerouslySetInnerHTML={{__html: script}}></script>
      </head>
      <body>
          {type == "home" ? <Home {...props.data}/> : <Page  {...props.data}/>}
          <style> {`body { font-family: \'${GoogleFonts[0]}\'}`} </style>
      </body>
    </html>
  )
}