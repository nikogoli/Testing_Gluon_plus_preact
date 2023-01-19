/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { Signal } from "../utils/signals.js"

export default function ClockArea( props: {time: Signal<string>} ){
  return (
    <div class='text-2xl'>
      <span>{props.time}</span>
    </div>
  )
}