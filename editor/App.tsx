/** @jsxRuntime classic */
/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { h } from "https://esm.sh/preact@10.10.6"
import { useState } from "https://esm.sh/preact@10.10.6/hooks"

import IconBrandDeno from "./icons/IconBrandDeno.tsx"
import SidePanel from "./SidePanel.tsx"

import Editor from "./Editor.tsx"

const App = () => {

  const [text, setText] = useState("function hello() {\n\talert('Hello world!');\n}")
  const [act_name, setActiveName] = useState("inital")

  return (
    <div class={`h-screen`}>
      <div class='p-4 h-full flex flex-col gap-6 justify-center'>
        <span class='flex gap-3'>
          <IconBrandDeno size={36} stroke-width={1} />
          <span class='text-3xl'>Deno App</span>
        </span>
        <div class="flex-1 flex gap-2">
          <SidePanel {...{setText, setActiveName}}/>
          <Editor {...{text, act_name}}/>
        </div>        
      </div>
    </div>
  )
}

export default App