import { useState } from "preact/hooks"

import Home from "./inner/home.tsx"
import Page from "./inner/page.tsx"

import { AppProps, Info } from "../types.ts"
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
  const ini_info = {page_idx: 0, title: "", text: ""}
  const [info, setInfo] = useState(ini_info)

  useNavigation((ev:Parameters<Parameters<typeof useNavigation>[0]>[0]) => {
    const func = async () => {
      if (ev.navigationType == "traverse"){
        const dest_state = ev.currentTarget!.currentEntry!.getState() ?? ini_info as Info
        setInfo(dest_state)
        return undefined
      }

      const { url } = ev.destination
      if (new URLPattern({pathname:"/home"}).test(url)){
        setInfo(ini_info)
        navigation.updateCurrentEntry({ state: ini_info })
      } else {
        await fetch(url)
        .then(res => res.json() as Promise<Info>)
        .then(jdata => {
          setInfo(jdata)
          navigation.updateCurrentEntry({ state: jdata })
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