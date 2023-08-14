import { ViewConfig } from "./types.ts"
import { default as Config } from "./misc/twind.config.ts"

export const VIEW_CONFIG: ViewConfig = {
  TITLE: "Deno App with Gluon",
  SIZE: [600, 400],
  DENOJSON_PATH: "../deno.json",
  GOOGLE_FONTS: [
    "Zen Maru Gothic",
    "Yusei Magic",
  ],
  TW_CONFIG: Config,
  USE_WORKER: true,
  PORT: 8088,
}