import * as Gluon from '../../gluon_src/index.js'
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"


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
  save_file: true
})

if (VIEW_CONFIG.USE_WORKER){
  Deno.env.set("ToppageFilePath", file_path)
  Deno.env.delete("RoutesDict")
}



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