/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import IconBrandDeno from "https://pax.deno.dev/nikogoli/tabler-icons-tsx/tsx/brand-deno.tsx"
import IconFileText from "https://pax.deno.dev/nikogoli/tabler-icons-tsx/tsx/file-text.tsx"


type AppProps = {
  data: Array<{title: string, path: string}>
}


export function PropsSetter():AppProps{
  const count = 5
  const data = [...Array(count)].map((_x, idx) => {
    return { title: `ページその ${idx+1}`, path: `/page/${idx+1}` }
  })
  return { data }
}


export default function App(props: AppProps){

  return (
    <div class={`h-screen grid gap-6 place-content-center justify-items-center`}>
      <span class='flex gap-3'>
        <IconBrandDeno size={36} stroke-width={1} />
        <span class='text-3xl'>Deno App</span>
      </span>
      <div class="flex flex-col gap-4">
        { props.data.map( ({title, path}) => {return (
          <div class="flex gap-1 hover:bg-gray cursor-pointer items-center"
                onClick={(ev) => window.open(path, "_self")}>
            <IconFileText size={22} stroke-width={1}/>
            <span class="text-lg">{title}</span>
          </div>
        )}) }
      </div>
    </div>
  )
}