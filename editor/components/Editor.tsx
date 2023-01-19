/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { useState, useEffect} from "https://esm.sh/preact@10.10.6/hooks"

import { Editor } from "../monaco_preact/mod.ts"
import { CodeEditor } from "../monaco_preact/types.ts"
import { EditorProps } from "../types.ts"
import { VIEW_CONFIG } from "../settings.ts"

export default function Monaco(props: EditorProps) {
  const [editor, setEditorRef] = useState<CodeEditor|null>(null)
  const [is_saved, toggleSaved] = useState(false)

  const on_key = (ev:KeyboardEvent) => {
    if (props.filename_sig.value.includes(".") && ev.ctrlKey && ev.key == "s"){
      ev.preventDefault()
      if (editor){
        const func = async () => {
          const req = new Request(
            `http://localhost:${VIEW_CONFIG.PORT}/api/save/${props.filename_sig.value}`,
            {
              method: "POST",
              headers: {"Content-Type":`text/plain`},
              body: editor.getValue()
            }
          )
          await fetch(req)
          toggleSaved(true)
        }
        func()
      }
    }
  }

  const onEditorMounted = (editor:CodeEditor, monaco:any) => {
    setEditorRef(editor)
  }

  useEffect(() => {
    if (is_saved){
      setTimeout( () => toggleSaved(false), 2000 )
    }
  }, [is_saved])

  return (
    <div class="flex-1 flex flex-col gap-1" key={props.filename_sig.value}>
      <div class={`transition ease-in-out fixed rounded top-8 right-48
                  p-3 border-1 border-[#737373] ${is_saved ? "" : "opacity-0"}`}>
        Saved!
      </div>
      <span class="bg-sky-100 rounded-t-lg rounded-x-lg px-2 ml-4" style={{"width":"fit-content"}}>
        {props.filename_sig}
      </span>
      <Editor
        height={"90%"}
        defaultLanguage="javascript"
        defaultValue={props.text_sig.value}
        onKeyDown={on_key}
        onMount={onEditorMounted}
      />
    </div>
  )
}