/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import IconSquareRotated from "https://pax.deno.dev/nikogoli/tabler-icons-tsx/tsx/square-rotated.tsx"

import { HomeProps } from "../types.ts"

export default function Home(props:HomeProps) {
  const { titles_data } = props
  const move = (ev: MouseEvent, title:string) => {
    const encorded = encodeURI(title)
    window.open(`/index/${encorded}`, "_self")
  }
  return (
    <div class="bg-neutral-100 text-orange-900" style={{height: "fit-content"}}>
      <div class="p-6 h-full w-full grid grid-cols-2 gap-4">
        { titles_data.map(d => {
          return(
            <div class="flex gap-3 cursor-pointer p-2 items-center hover:bg-neutral-200"
                  onClick={(ev) => move(ev, d.title)}>
              <IconSquareRotated class="w-[22px] h-[22px]"
                  style={{"stroke-width": "1pt"}} />
              <span class="text-xl">{d.title}</span>
              <span class="">{d.author}</span>
            </div>
          )
        }) }
      </div>
    </div>
  )
}