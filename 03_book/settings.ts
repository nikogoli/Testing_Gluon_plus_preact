import { ViewConfig } from "./types.ts"
import { default as Config } from "./misc/twind.config.ts"

export const VIEW_CONFIG: ViewConfig = {
  SIZE: [900, 650],
  CRIENT_PATH: "./tempClient.tsx",
  GOOGLE_FONTS: [
    "Yuji Syuku",
    "Zen Maru Gothic",
    "Yusei Magic",
  ],
  TW_CONFIG: Config,
  PORT: 8080,
  USE_WORKER: true,
}