/** @jsx h */
import { h, render, ComponentProps } from "https://esm.sh/preact@10.10.6"
import { useState, useEffect, useRef } from "https://esm.sh/preact@10.10.6/hooks"

import { PanelProps, Hierarchy_x3, ReturndHierarchy } from "../types.ts"
import { VIEW_CONFIG } from "../settings.ts"


import IconFiles from "https://pax.deno.dev/nikogoli/tabler_icons_tsx@0.0.3/tsx/files.tsx"


function ListPanel(props:{
  names: Hierarchy_x3,
  root_name: string,
} & PanelProps & ComponentProps<"div">){

  const when_clicked = (ev: MouseEvent, name:string) => {
    const func = async () => {
      await fetch(`http://localhost:${VIEW_CONFIG.PORT}/api/files/${name}`)
        .then(res => res.text())
        .then(tx => {
          props.text_sig.value = tx
          props.filename_sig.value = name
        })
        .catch(_res => window.alert("ファイルが見つかりませんでした"))
    }
    func()
  }

  const arrange_hy = (name:string, hy:null | Hierarchy_x3) => {
    if (hy === null){
      return (
        <button onClick={(ev) => when_clicked(ev, name)}
                class="focus:outline-none text-left px-2 hover:bg-gray-200">
          {name}
        </button>
      )
    } else {
      return (
        <details class="px-2 ">
          <summary>{name}</summary>
          <div class="flex">
            <span class="w-1 border-r border-gray-400"></span>
            <div class="pt-2 pl-1 flex flex-col gap-2">
              {Object.entries(hy).map(([k,v]) => arrange_hy(k, v))}
            </div>
          </div>
        </details>
      )
    }
  }

  return(
    <div class="min-w-24 max-h-full flex flex-col gap-2 text-sm overflow-y-scroll">
      <span class="bg-gray-400 px-2">{props.root_name}</span>
      {Object.entries(props.names).map(([k,v]) => arrange_hy(k, v))}
    </div>
  )
}


export default function SidePanel(props:PanelProps) {
  const [is_open, toggleOpen] = useState(false)
  const container_ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const func = async () => {
      const j_data:ReturndHierarchy = await fetch(`http://localhost:${VIEW_CONFIG.PORT}/api/files/all`).then(res => res.json())
      const { root:root_name, names } = j_data
      if (container_ref.current){
        render(<ListPanel {...{names, root_name, ...props}} />, container_ref.current)
      }
    }
    func()
  }, [])

  return (
    <div class="flex h-[28rem] gap-1 p-1 border border-gray-400 rounded-lg">
      <div class="flex flex-col">
        <button class="focus:outline-none" onClick={() => toggleOpen(prev => !prev)}>
          <IconFiles class="w-8 h-8" stroke-width={1} />
        </button>
      </div>
      <div class={`${is_open ? "block" : "hidden"} bg-gray-100`} ref={container_ref}>
      </div>
    </div>
  )
}