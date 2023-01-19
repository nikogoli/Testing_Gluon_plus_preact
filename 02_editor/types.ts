import { Signal } from "./utils/signals.js"

type DistMerge<
  Base extends Record<string,unknown>,
  Diff extends Record<string,unknown>
> = Diff extends any ? { [K in keyof (Base&Diff)]: (Base&Diff)[K] } : never


export type ViewConfig = DistMerge<{
  TITLE: string,
  SIZE: [number, number],
  CRIENT_PATH: string,
  GOOGLE_FONTS?: Array<string>,
  TW_CONFIG?: Record<string, unknown>,
}, {
  USE_WORKER: true,
  PORT: number,
} | {
  USE_WORKER: false,
}>


export type SetViewProps = {
  route: string,
  path: string,
  save_file: boolean,
  handler?: () => Record<string, unknown> | Promise<Record<string, unknown>>
}


export type PanelProps = {
  text_sig: Signal<string>,
  filename_sig: Signal<string>
}

export type EditorProps = {
  text_sig: Signal<string>,
  filename_sig: Signal<string>
}

export type Hierarchy_x3 = Record<string, null|Record<string, null|Record<string, null>>>


export type ReturndHierarchy = {
  root: string,
  names: Hierarchy_x3
}