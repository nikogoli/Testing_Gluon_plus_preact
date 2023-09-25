/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { useEffect } from "https://esm.sh/preact@10.10.6/hooks"

import MovePageButtons from "../components/MovePageButtons.tsx"

import { PageProps } from "../types.ts"


export default function Page(props: PageProps) {
  const {title, text} = props.info

  useEffect(() => {
    self.window.addEventListener("beforeunload", (event) => {
      fetch(`/signal/unload`)
    })  
  },[])
  
  return (
    <div class="h-screen p-8 flex flex-col gap-4">
      <div class="flex pb-4">
        <span class="text-3xl flex-1">{title}</span>
        <MovePageButtons {...props} />
      </div>
      <span>{text}</span>
    </div>
  )
}