/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import IconBrandDeno from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/brand-deno.tsx"
import IconFileText from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/file-text.tsx"


export default function App(){

  return (
    <div class={`h-screen grid gap-6 place-content-center justify-items-center`}>
      <span class='flex gap-3'>
        <IconBrandDeno size={36} stroke-width={1} />
        <span class='text-3xl'>Deno App</span>
      </span>
      <div class="flex flex-col gap-4">
        {[...Array(5)].map((_x, idx) => { return(
          <div class="flex gap-1 hover:bg-gray cursor-pointer items-center"
                onClick={(ev) => window.open(`/page/${idx+1}`, "_self")}>
            <IconFileText size={22} stroke-width={1}/>
            <span class="text-xl">{`ページその ${idx+1}`}</span>
          </div>
        ) })}
      </div>
    </div>
  )
}