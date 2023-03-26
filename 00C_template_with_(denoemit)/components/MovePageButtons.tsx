/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import IconHome from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/home.tsx"
import IconSquareArrowLeft from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/square-arrow-left.tsx"
import IconSquareArrowRight from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/square-arrow-right.tsx"


export default function MovePageButtons(props:{ idx:number }){
  return(
    <div class="p-1 border-2 rounded-xl flex gap-2" style={{height: "fit-content"}}>
        { props.idx > 1
            ? <a href={`/page/${ props.idx-1}`}>
                <IconSquareArrowLeft class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
              </a>
            : <IconSquareArrowLeft class="text-[#737373]" size={30} stroke-width={"1px"}/>
        }
        <a href={"/"}>
          <IconHome class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
        </a>
        { props.idx < 5
            ? <a href={`/page/${ props.idx+1}`}>
                <IconSquareArrowRight class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
              </a>
            : <IconSquareArrowRight class="text-[#737373]" size={30} stroke-width={"1px"}/>
        }
      </div>
  )
}