/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h } from "https://esm.sh/preact@10.10.6"
import { useState, useEffect } from "https://esm.sh/preact@10.10.6/hooks"

import IconBrandDeno from "https://pax.deno.dev/nikogoli/tabler-icons-tsx/tsx/brand-deno.tsx"


import { MyTimePanel } from "./Components.tsx"


const App = () => {

  const [time, setTime] = useState(new Date().toTimeString().split(" ")[0])
  const [is_dark, setDark] = useState(false)

  const sty = is_dark ? "bg-black text-white" : "bg-white text-black"
  const deno_type = is_dark ? "Dark Deno" : "Light Deno"
  
  useEffect(() => {
    const timer = setInterval(
      () => setTime(new Date().toTimeString().split(" ")[0]), 1000
    )
    return () => clearInterval(timer)
  })

  return (
    <div class={`h-screen ${sty}`}>
      <div class='p-4'>
        <div class='mt-8 grid grid-cols-1 gap-6 justify-items-center'>
          <span class='flex gap-3'>
            <IconBrandDeno size={36} stroke-width={1} />
            <span class='text-3xl'>Deno App</span>
          </span>
          <MyTimePanel time={time} />
          <button class='p-3 border-2 rounded-lg focus:outline-none'
                  onClick={() => setDark(prev => !prev)}>
            {deno_type}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App