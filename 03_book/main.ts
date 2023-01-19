import * as Gluon from '../gluon_src/index.js'
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"
import { walk } from "https://deno.land/std@0.155.0/fs/mod.ts"

import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"
import { TextInfo } from './types.ts'

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



// ------- Set Web worker ----------
if (VIEW_CONFIG.USE_WORKER){
  const _worker = new Worker(
    join(dirname(import.meta.url), "worker.ts"),
    { type: "module" },
  )
}



// ------- Create Home html ---------
const { file_path } = await setHTML({
  route: "index.tsx",
  path: Name2Path_dict["index.tsx"],
  save_file: true
})

if (VIEW_CONFIG.USE_WORKER){ Deno.env.set("ToppageFilePath", file_path) }



// ------- Start Gluon ---------
const _Browser = await Gluon.open(
  (VIEW_CONFIG.USE_WORKER) ? `http://localhost:${VIEW_CONFIG.PORT}/` : file_path,
  {
    windowSize: VIEW_CONFIG.SIZE,
    forceBrowser: null,
    onLoad: () => {}
  }
)

//worker.terminate()