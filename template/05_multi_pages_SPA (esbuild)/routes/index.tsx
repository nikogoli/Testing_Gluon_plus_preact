import { useState } from "preact/hooks"

import Home from "./inner/home.tsx"
import Page from "./inner/page.tsx"

import { AppProps } from "../types.ts"
import useNavigation from "../utils/useNaviagation.ts"


export async function PropsSetter():Promise<AppProps>{
  const titles = []
  for await (const fl of Deno.readDir("./static/pagedata")){
    titles.push(fl.name.split(".")[0])
  }
  const max_len = titles.length
  return { titles, max_len }
}


export default function App(props:AppProps){
  const [info, setInfo] = useState({page_idx: 0, title: "", text: ""})

  useNavigation((ev:Parameters<Parameters<typeof useNavigation>[0]>[0]) => {
    const func = async () => {
      const { url } = ev.destination
      if (new URLPattern({pathname:"/home"}).test(url)){
        setInfo({page_idx: 0, title: "", text: ""})
      }
      else if (new URLPattern({pathname:"/page/:idx"}).test(url)){
        const idx = new URLPattern({pathname:"/page/:idx"}).exec(url)!.pathname.groups["idx"]!
        await fetch(`/page/${idx}`)
          .then(res => res.json() as Promise<{title: string, text:string}>)
          .then(jdata => {
            const { title, text } = jdata
            setInfo({page_idx: Number(idx), title, text})
          })
      }
      return undefined
    }
    return func
  })

  return (
    <div id="root">
      {info.page_idx == 0
          ? <Home {...props}/>
          : <Page {...{max_len: props.max_len, info}}/>
      }
    </div>
  )
}