type DistMerge<
  Base extends Record<string,unknown>,
  Diff extends Record<string,unknown>
// deno-lint-ignore no-explicit-any
> = Diff extends any ? { [K in keyof (Base&Diff)]: (Base&Diff)[K] } : never


export type ViewConfig = DistMerge<{
  TITLE: string,
  SIZE: [number, number],
  DENOJSON_PATH: string,
  GOOGLE_FONTS?: Array<string>,
  TW_CONFIG?: Record<string, unknown>,
}, {
  USE_WORKER: true,
  PORT: number,
} | {
  USE_WORKER: false,
  PORT?: number,
}>


export type SetViewProps = {
  route: string,
  save_file: boolean,
  props_setter?: () => Record<string, unknown> | Promise<Record<string, unknown>>,
  import_map_url?: string,
}