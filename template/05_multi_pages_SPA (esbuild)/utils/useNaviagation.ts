import { useEffect } from "preact/hooks"
import {
  NavigationEvent,
  NavigateEvent,
  NavigationInterceptOptions,
} from "./navigation_api.d.ts"


export default function useNavigation(
  get_handler: (ev:NavigateEvent) => NavigationInterceptOptions["handler"]
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
      console.log(ev)
      ev.intercept({ handler: get_handler(ev) })
    })
  }, [])
}