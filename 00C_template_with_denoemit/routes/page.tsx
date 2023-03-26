/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

import MovePageButtons from "../components/MovePageButtons.tsx"


export default function Page(props:{title: string, text: string, idx:number}) {
  
  return (
    <div class="h-screen p-8 flex flex-col gap-4">
      <div class="flex pb-4">
        <span class="text-3xl flex-1">{props.title}</span>
        <MovePageButtons {...{idx: props.idx}} />
      </div>
      <span>{props.text}</span>
    </div>
  )
}