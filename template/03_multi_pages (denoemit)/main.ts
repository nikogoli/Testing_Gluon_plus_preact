import * as Gluon from '../../gluon_src/index.js'
import { join, dirname } from "https://deno.land/std@0.171.0/node/path.ts"

import { setHTML } from "./utils/setHTML.tsx"
import { VIEW_CONFIG } from "./settings.ts"


// ------- Set Web worker ----------
const myWorker = (VIEW_CONFIG.USE_WORKER)
  ? new Worker(
    join(dirname(import.meta.url), "worker.ts"),
    { type: "module" },
  )
  : null



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
const Browser = await Gluon.open(
  (VIEW_CONFIG.USE_WORKER) ? `http://localhost:${VIEW_CONFIG.PORT}/` : file_path,
  {
    windowSize: VIEW_CONFIG.SIZE,
    forceBrowser: null,
    onLoad: () => {}
  }
)

if (myWorker && Browser){
  myWorker.addEventListener("message", async (msg)=>{
    if (msg.data == "unload"){
      console.log("check")
      try {
        await Browser.cdp.send(`Browser.getVersion`)  
      } catch (error) {
        if (String(error).includes("not OPEN")){
          Browser.close()
          myWorker.terminate()
          Deno.exit()
        } else {
          throw error
        }
      }
    }
  })
}