/** @jsx h */
import { h, Fragment, ComponentProps } from "https://esm.sh/preact@10.10.6"
import { useEffect, useRef } from "https://esm.sh/preact@10.10.6/hooks"

import { PageProps } from "../types.ts"
import { handle_rubi, replace_unicode } from "../utils/text_handler.ts"


function SectionElement(props:{
  section_title:string|null,
  lines:Array<Array<string>>
}&ComponentProps<"div">){
  const {section_title, lines, ...other} = props
  const handled = handle_rubi(lines)
  return(
    <div {...other} class={`flex flex-col ${props.class ? props.class : ""}`}>
      {(section_title) ? <span class="text-xl pt-12 pr-12">{replace_unicode(section_title)}</span>  : <Fragment />}
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
  // ad-hoc
  const quote_line = props.lines[0][0]
  const [ line, from ] = quote_line.slice(0,-1).split("（")
  return(
    <div class="pl-8 pt-10 h-[85%] italic flex flex-col gap-2">
      <span>{line}</span>
      <span class="self-end not-italic -mb-10"><span>——</span>{from}</span>
    </div>
  )
}

export default function Page(props:PageProps) {
  if (props.title === null){
    return (
      <div class="bg-neutral-100 text-orange-900 min-h-full"
          style={{"height": "fit-content", "writing-mode": "vertical-rl"}}>
        <span class="py-6 px-10 text-xl">要求された文書は存在しません</span>
      </div>
    )
  }

  const { title, author, lines_data } = props
  const title_ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (title_ref.current){ title_ref.current.scrollIntoView(false)}
  },[])

  return (
    <div class="bg-neutral-100 text-orange-900 min-h-full"
          style={{"height": "fit-content", "writing-mode": "vertical-rl"}}
          onWheel={(ev) => window.scrollBy({left: -ev.deltaY*2, behavior: "smooth"})}>
      <div class="py-6 px-10 min-w-full h-full flex flex-col gap-10 justify-center">
        <span class="pl-12 mr-4 w-12 flex gap-4" ref={title_ref}>
          <span class="flex-1 text-2xl self-center">{replace_unicode(title)}</span>
          <span class="self-center pb-10">{author}</span>
        </span>
        { lines_data.map(d => {
          if (d.section == "QUOTE"){ return <QuoteElement lines={d.lines} /> }
          else if (d.section == "TOP"){
            return <SectionElement class={"gap-10 pt-4"} {...{section_title:null, lines:d.lines}}  />
          }
          else {
            return <SectionElement class={"gap-10 pt-4"} {...{section_title:d.section, lines:d.lines}} />
          }
        }) }
      </div>
    </div>
  )
}