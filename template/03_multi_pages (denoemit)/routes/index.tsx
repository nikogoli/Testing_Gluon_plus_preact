/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import IconBrandDeno from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/brand-deno.tsx"
import IconFileText from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/file-text.tsx"

import { AppProps } from "../types.ts"


export async function PropsSetter():Promise<AppProps>{
  const titles = []
  for await (const fl of Deno.readDir("./static/pagedata")){
    titles.push(fl.name.split(".")[0])
  }
  const max_len = titles.length
  return { titles, max_len }
}


export default function App(props: AppProps){

  return (
    <div class={`h-screen grid gap-6 place-content-center justify-items-center`}>
      <span class='flex gap-3'>
        <IconBrandDeno size={36} stroke-width={1} />
        <span class='text-3xl'>Deno App</span>
      </span>
      <div class="flex flex-col gap-4">
        { props.titles.map( (title, idx) => {return (
          <div class="p-1 hover:bg-gray-200">
            <a href={`/page/${idx+1}`} class="flex gap-1 items-center">
              <IconFileText size={22} stroke-width={1}/>
              <span class="text-lg">{title}</span>
            </a>
          </div>
        )}) }
      </div>
    </div>
  )
}