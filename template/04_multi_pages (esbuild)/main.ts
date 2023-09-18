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


// -------- get import-map URL --------
let import_map_url: string | undefined = undefined
try {
  import_map_url = await Deno.readTextFile("./deno.json")
    .then(tx => JSON.parse(tx) as Record<string, string>).then(jdata => jdata.importMap)
  if (import_map_url){
    Deno.env.set("import_map_url", import_map_url)
  }
} catch (_error) {
  // pass
}


// ------- Create Home html ---------
Deno.env.delete("RoutesDict")

const { file_path } = await setHTML({
  route: "index.tsx",
  save_file: true,
  import_map_url
})

if (VIEW_CONFIG.USE_WORKER){
  Deno.env.set("ToppageFilePath", file_path)
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