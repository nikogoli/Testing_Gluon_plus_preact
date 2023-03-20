/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { signal } from "../utils/signals.js"

import IconBrandDeno from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/brand-deno.tsx"
import SidePanel from "../components/SidePanel.tsx"
import Editor from "../components/Editor.tsx"


export default function App(){

  const text_sig = signal("function hello() {\n\talert('Hello world!');\n}")
  const filename_sig = signal("ファイル未選択")

  return (
    <div class={`h-screen`}>
      <div class='p-4 h-full flex flex-col gap-6 justify-center'>
        <span class='flex gap-3'>
          <IconBrandDeno size={36} stroke-width={1} />
          <span class='text-3xl'>Deno App</span>
        </span>
        <div class="flex-1 flex gap-2">
          <SidePanel {...{text_sig, filename_sig}}/>
          <Editor {...{text_sig, filename_sig}}/>
        </div>        
      </div>
    </div>
  )
}