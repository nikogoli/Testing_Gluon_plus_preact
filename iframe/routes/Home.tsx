/** @jsx h */
import { h, JSX } from "https://esm.sh/preact@10.10.6"
import { setViewProps } from "../types.ts"


export default function Home(props: {url:string}) {
  return (
    <div class="h-full bg-neutral-100">
      <iframe
        id="inlineFrameZenn"
        title="Inline Frame Zenn"
        width="600"
        height="400"
        src={props.url}
      ></iframe>
    </div>
  )
}