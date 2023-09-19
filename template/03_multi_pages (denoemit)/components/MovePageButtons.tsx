/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import IconHome from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/home.tsx"
import IconSquareRoundedArrowLeft from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/square-arrow-left.tsx"
import IconSquareRoundedArrowRight from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/square-arrow-right.tsx"

import { PageProps } from "../types.ts"


function LeftIcon(props:{colorcode: string}){
  return (
    <IconSquareRoundedArrowLeft class={`text-[${props.colorcode}]`} size={30} stroke-width={"1px"}/>
  )
}


function RightIcon(props:{colorcode: string}){
  return (
    <IconSquareRoundedArrowRight class={`text-[${props.colorcode}]`} size={30} stroke-width={"1px"}/>
  )
}


export default function MovePageButtons(props:PageProps){
  const { info, max_len } = props
  return(
    <div class="p-1 border-2 rounded-xl flex gap-2" style={{height: "fit-content"}}>
      { info.page_idx > 1
          ? <a href={`/page/${info.page_idx-1}`}><LeftIcon colorcode="#2563eb" /></a>
          : <LeftIcon colorcode="#737373" />
      }
      <a href={`/`}>
        <IconHome class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
      </a>
      { info.page_idx < max_len
          ? <a href={`/page/${info.page_idx+1}`}><RightIcon colorcode="#2563eb" /></a>
          : <RightIcon colorcode="#737373" />
      }
    </div>
  )
}