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

  useNavigation(async (ev:Parameters<Parameters<typeof useNavigation>[0]>[0]) => {
    if (ev.navigationType == "traverse"){
      const dest_state = (ev.currentTarget!.currentEntry!.getState() ?? ini_info) as Info
      setInfo(dest_state)
      return undefined
    }

    const { url } = ev.destination
    let state_data: Info
    if (new URLPattern({pathname:"/home"}).test(url)){
      state_data = ini_info
    } else {
      state_data = await fetch(url).then(res => res.json() as Promise<Info>)
    }
    setInfo(state_data)
    navigation.updateCurrentEntry({ state: state_data })

    return undefined
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