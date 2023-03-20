/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { useState, useEffect } from "https://esm.sh/preact@10.10.6/hooks"
import { signal } from "../utils/signals.js"

import IconBrandDeno from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/brand-deno.tsx"
import ClockArea from "../components/ClockArea.tsx"


export default function App(){

  const time_sig = signal(new Date().toTimeString().split(" ")[0])
  const [is_dark, setDark] = useState(false)

  const sty = is_dark ? "bg-black text-white" : "bg-white text-black"
  
  useEffect(() => {
    const timer = setInterval(
      () => time_sig.value = new Date().toTimeString().split(" ")[0], 1000
    )
    return () => clearInterval(timer)
  })

  return (
    <div class={`h-screen grid gap-6 place-content-center justify-items-center ${sty}`}>
      <span class='flex gap-3'>
        <IconBrandDeno size={36} stroke-width={1} />
        <span class='text-3xl'>Deno App</span>
      </span>
      <ClockArea time={time_sig} />
      <button class='p-3 border-2 rounded-lg' onClick={() => setDark(prev => !prev)}>
        { is_dark ? "Dark Deno" : "Light Deno" }
      </button>
    </div>
  )
}