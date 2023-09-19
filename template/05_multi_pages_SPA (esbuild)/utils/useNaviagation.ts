import { useEffect } from "preact/hooks"
import {
  NavigationEvent,
  NavigationInterceptOptions,
} from "./navigation_api.d.ts"


export default function useNavigation(
  get_handler: (ev:NavigationEvent) => NavigationInterceptOptions["handler"]
){
  useEffect(() => {
    const navi = window.navigation
    ?  window.navigation
    : {addEventListener: (_name:string, _lisner: (ev:NavigationEvent) => void)=> {}}

    navi.addEventListener('navigate', ev => {
      if (
        !ev.canIntercept || ev.hashChange ||
        ev.downloadRequest || ev.formData
      ){
          return
      }
      ev.intercept({ handler: get_handler((ev as NavigationEvent)) })
      console.log(ev)
    })
  }, [])
}