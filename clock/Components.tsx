/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"

 export function MyTimePanel( props: {time: string} ){
  return (
    <div class='text-2xl'>
      <span>{props.time}</span>
    </div>
  )
 }