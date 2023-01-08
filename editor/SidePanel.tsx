/** @jsx h */
import { h, ComponentProps } from "https://esm.sh/preact@10.10.6"
import { useState, useEffect, StateUpdater } from "https://esm.sh/preact@10.10.6/hooks"

import IconFiles from "./icons/IconFiles.tsx"

type PanelProps = {
  setText: StateUpdater<string>,
  setActiveName: StateUpdater<string>
}

type Hierarchy = Record<string, null|Record<string, null|Record<string, null>>>

function ListPanel(props:{
  names: Hierarchy,
  root_name: string,
  setText: StateUpdater<string>,
  setActiveName: StateUpdater<string>
} & ComponentProps<"div">){

  const when_clicked = (ev: MouseEvent, name:string) => {
    const func = async () => {
      const j_data = await fetch(`http://localhost:8080/api/files/${name}`).then(res => res.json())
      if ("text" in j_data){
        console.log(j_data.text)
        props.setText(j_data.text)
        props.setActiveName(name)
      } else {
        console.log(j_data)
      }
    }
    func()
  }

  const arrange_hy = (name:string, hy:null | Hierarchy) => {
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
  const [names, setNames] = useState<Hierarchy>({})
  const [root_name, setRootName] = useState("")

  useEffect(() => {
    const func = async () => {
      const j_data = await fetch("http://localhost:8080/api/files/all").then(res => res.json())
      if ("names" in j_data && "root" in j_data){
        setRootName(j_data.root)
        setNames(j_data.names)
      } else {
        console.log(j_data)
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
      <div class={`${is_open ? "block" : "hidden"} bg-gray-100`}>
        <ListPanel {...{names, root_name, ...props}} />
      </div>
    </div>
  )
}