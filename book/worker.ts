import { serve } from "https://deno.land/std@0.155.0/http/server.ts"
import { walk } from "https://deno.land/std@0.155.0/fs/mod.ts"

import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"
import { PageProps, TextInfo } from "./types.ts"


const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}

// ------ Get route files ----------
const route_files_to_dict = async (dict: Record<string, string>) =>{
  const file_iteratior = walk("./routes",
   { maxDepth: 1, match: [/\.tsx$/, /\.jsx$/] }
  )
  for await (const fl of file_iteratior){
    dict[fl.name] = fl.path.replaceAll("\\", "/")
  }
  return dict
}
const Name2Path_dict = await route_files_to_dict({})


const Text_Info:TextInfo  = await Deno.readTextFile("./static/sango_shu/info.json").then(tx => JSON.parse(tx))


const PTRN_idx = new URLPattern({ pathname: '/index/:title' })


const server = serve( async (req) => {  
  console.log(`[worker] called with: ${req.url}`)
  if (req.url == `http://localhost:${VIEW_CONFIG.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  else if (PTRN_idx.test(req.url)){
    const Handler: ()=>PageProps = () => {
      const title = PTRN_idx.exec(req.url)!.pathname.groups["title"]
      const data = Text_Info.texts_data.find(d => d.title == decodeURI(title))
      return data ?? { title: null }
    }

    const { html } = await setHTML({
      route: "page.tsx",
      path: Name2Path_dict["page.tsx"],
      save_file: false,
      handler: Handler
    })
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})    
  }
  const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/pain`})
  return new Response("", {headers, status: 404})
}, { port: VIEW_CONFIG.PORT })

await server