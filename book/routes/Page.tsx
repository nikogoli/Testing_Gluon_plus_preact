/** @jsx h */
import { h, Fragment, JSX, ComponentProps } from "https://esm.sh/preact@10.10.6"

import { PageProps } from "../types.ts"
import { handle_rubi } from "../utils/text_handler.ts"

function SectionElement(props:{
  section_title:string|null,
  lines:Array<Array<string>>
}&ComponentProps<"div">){
  const {section_title, lines, ...other} = props
  const handled = handle_rubi(lines)
  return(
    <div {...other} class={`flex flex-col ${props.class ? props.class : ""}`}>
      {(section_title) ? <span class="text-xl pr-12">{section_title}</span>  : <Fragment />}
      { handled.map(lines => {
        return (
          <div class="flex flex-col gap-2">
            { lines.map(elems => {
              return (
                <span>{ 
                  elems.map(elem => {
                    if (elem.type == "text"){
                      return (<span>{elem.text}</span>)
                    } else {
                      return (<ruby>{elem.text}<rt>{elem.rubi}</rt></ruby>)
                    }
                  })
                }</span>
              )
            }) }
          </div>
        )}
      )}
    </div>
  )
}


function QuoteElement(props:{lines:Array<Array<string>>}){
  return(
    <div class="pl-8 py-2 italic flex flex-col gap-4">
      { props.lines.map(texts => {
        return (
          <div class="flex flex-col gap-2">
            { texts.map(tx => <span>{tx}</span>) }
          </div>
        )}
      )}
    </div>
  )
}

export default function Page(props:PageProps) {
  const { title, author, lines_data } = props
  return (
    <div class="w-full bg-neutral-100 text-orange-900 min-h-screen"
          style={{"height": "fit-content", "writing-mode": "vertical-rl"}}>
      <div class="p-6 w-full h-full flex flex-col gap-8 justify-center">
        <span class="pl-12 w-12 flex gap-4">
          <span class="flex-1 text-2xl self-center">{title}</span>
          <span class="self-center pb-12">{author}</span>
        </span>
        { lines_data.map(d => {
          if (d.section == "QUOTE"){ return <QuoteElement lines={d.lines} /> }
          else if (d.section == "TOP"){
            return <SectionElement class={"gap-8 pt-4"} {...{section_title:null, lines:d.lines}}  />
          }
          else {
            return <SectionElement class={"gap-8 pt-4"} {...{section_title:d.section, lines:d.lines}} />
          }
        }) }
      </div>
    </div>
  )
}