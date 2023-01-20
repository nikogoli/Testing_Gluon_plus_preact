/** @jsx h */
import { h, JSX } from "https://esm.sh/preact@10.10.6"
import { useEffect, useRef } from "https://esm.sh/preact@10.10.6/hooks"
import IconSquareRotated from "https://pax.deno.dev/nikogoli/tabler-icons-tsx/tsx/square-rotated.tsx"

import { HomeProps, TextInfo } from "../types.ts"
import { replace_unicode } from "../utils/text_handler.ts"


export async function PropsSetter(): Promise<HomeProps>{
  const text_info:TextInfo = await Deno.readTextFile("./static/sango_shu/info.json")
    .then(tx => JSON.parse(tx))
  const { texts_data, ...book_info } = text_info
  const titles_data = texts_data.map(d => {return { title: d.title, author: d.author }})
  return { titles_data, book_info }
}


export default function Home(props:HomeProps) {
  const { titles_data, book_info } = props

  const move = (ev: MouseEvent, title:string) => {
    const encorded = encodeURI(title)
    window.open(`/index/${encorded}`, "_self")
  }

  const title_ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (title_ref.current){ title_ref.current.scrollIntoView(false)}
  },[])

  return (
    <div class="h-full bg-neutral-100 text-orange-900" style={{"writing-mode": "vertical-rl"}}
        onWheel={(ev) => window.scrollBy({left: -ev.deltaY*2, behavior: "smooth"})}
    >
      <div class="p-6 min-h-full min-w-full flex flex-col gap-4">
        <span class="mr-4 pl-10 w-12 flex gap-4 items-center"ref={title_ref} >
          <span class="text-2xl">{book_info.title}</span>
          <span class="text-lg">— {book_info.subtitle} —</span>
          <span class="text-lg flex-1">{book_info.author}</span>
          <span><a href={book_info.from} class="text-sky-600">青空文庫</a>より</span>
        </span>
        { titles_data.map(d => {
          return(
            <div class="flex gap-3 cursor-pointer p-2 items-center hover:bg-neutral-200"
                  onClick={(ev) => move(ev, d.title)}>
              <IconSquareRotated class="w-[22px] h-[22px]" style={{"stroke-width": "1pt"}} />
              <span class="text-xl">{replace_unicode(d.title)}</span>
              <span class="">{d.author}</span>
            </div>
          )
        }) }
        <span class="pr-10 self-end w-12 flex gap-4 items-center">
          <span >入力：{book_info.creator}</span>
          <span>校正：{book_info.revise}</span>
        </span>
      </div>
    </div>
  )
}