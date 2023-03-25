import { Fragment } from "https://esm.sh/preact@10.10.6"

import { VIEW_CONFIG } from "../settings.ts"

export function HeaderHTML(props:{script:string}){
  const { GOOGLE_FONTS, TW_CONFIG } = VIEW_CONFIG
  const fontlink = (GOOGLE_FONTS)
    ? GOOGLE_FONTS.reduce((txt, f) => txt+`family=${f.replaceAll(" ", "+")}&`, "https://fonts.googleapis.com/css2?") + "display=swap"
    : null

  return(
    <head>
      <meta charSet="utf-8"/>
      <title>{VIEW_CONFIG.TITLE}</title>
      { (GOOGLE_FONTS && fontlink)
        ? <link href={fontlink} rel="stylesheet"></link>
        : <Fragment></Fragment>
      }
      <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
      { (TW_CONFIG)
        ? <script type="twind-config" dangerouslySetInnerHTML={{__html: JSON.stringify(TW_CONFIG)}}></script>
        : <Fragment></Fragment>
      }
      <script type="module" dangerouslySetInnerHTML={{__html: props.script}}></script>
      <style> {`button:focus { outline-style: none !important}`} </style>
    </head>
  )
}