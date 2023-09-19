import MovePageButtons from "../components/MovePageButtons.tsx"

import { PageProps } from "../types.ts"


export default function Page(props: PageProps) {
  const {title, text} = props.info
  
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