import { serve } from "https://deno.land/std@0.155.0/http/server.ts"
import { walk } from "https://deno.land/std@0.155.0/fs/mod.ts"
import { dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import { ReturndHierarchy } from "./types.ts"
import { VIEW_CONFIG } from "./settings.ts"
const View_Config = (VIEW_CONFIG.USE_WORKER) ? VIEW_CONFIG : {...VIEW_CONFIG, PORT:8088}

const HEADER_OPTION = {
  'Access-Control-Allow-Method':  'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Origin',
  'Access-Control-Allow-Origin': 'null'
}

const BASE_PATH = decodeURI(dirname(import.meta.url).replace("file:///", ""))

function set_data(names:Array<string>, data:Record<string, any>){
  if (names.length == 1){
    data[names[0]] = null
  } else {
    if (!(names[0] in data)){ data[names[0]] = {} }
    set_data(names.slice(1), data[names[0]])
  }
}

const file_iteratior = walk(BASE_PATH,
  { maxDepth: 3, match: [/\.tsx$/, /\.ts$/, /\.jsx$/, /\.js$/, /\.txt$/, /\.json$/, /\.md$/] }
)

const name_to_path_dict:  Record<string, string> = {}
const hierarchy: Record<string, any> = {}
for await (const fl of file_iteratior){
  const pathnames = fl.path.replaceAll("\\", "/").replace(BASE_PATH+"/", "").split("/")
  set_data(pathnames, hierarchy)
  name_to_path_dict[fl.name] = fl.path
}


const server = serve( async (req) => {
  const url = new URL(req.url)
  const file_pattern = new URLPattern({ pathname: '/api/files/:name' })
  const save_pattern = new URLPattern({ pathname: '/api/save/:name' })
  let HEADER = new Headers(HEADER_OPTION)
  
  if (req.url == `http://localhost:${View_Config.PORT}/` && Deno.env.get("ToppageFilePath")){
    const html = await Deno.readTextFile(Deno.env.get("ToppageFilePath")!)
    const headers = new Headers({...HEADER_OPTION, "Content-Type":`text/html`})
    return new Response(html, {headers, status: 200})
  }
  else if (file_pattern.test(url)){
    const { groups } = file_pattern.exec(url)!.pathname
    if ("name" in groups){
      const { name } = groups
      if (name == "all"){
        const Data: ReturndHierarchy = {names :hierarchy, root: BASE_PATH.split("/").at(-1)!}
        HEADER = new Headers({...HEADER_OPTION, "Content-Type":`application/json`})
        return new Response(JSON.stringify(Data), {headers: HEADER, status: 200})
      }
      else if (name in name_to_path_dict){
        const tx = await Deno.readTextFile(name_to_path_dict[name])
        HEADER = new Headers({...HEADER_OPTION, "Content-Type":`text/plain`})
        return new Response(tx, {headers: HEADER, status: 200})
      }
    }
    HEADER = new Headers({...HEADER_OPTION, "Content-Type":`text/plain`})
    return new Response("", {headers: HEADER, status: 404})
  }
  else if (save_pattern.test(url)){
    const { groups } = save_pattern.exec(url)!.pathname
    if ("name" in groups){
      const {name} = groups
      const tx = await req.text()
      await Deno.writeTextFile(name_to_path_dict[name], tx)

      HEADER = new Headers({...HEADER_OPTION, "Content-Type":`text/plain`})
      return new Response("", {headers: HEADER, status: 200})
    }
  }
  
  return new Response("", {headers: HEADER, status: 404})
}, { port: View_Config.PORT });

await server