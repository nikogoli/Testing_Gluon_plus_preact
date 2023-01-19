export type ViewConfig = {
  SIZE: [number, number],
  CRIENT_PATH: string,
  PORT: number,
  USE_WORKER: boolean,
  GOOGLE_FONTS?: Array<string>,
  TW_CONFIG?: Record<string, unknown>,
}


export type SetViewProps = {
  route: string,
  path: string,
  save_file: boolean,
  handler?: () => Record<string, unknown> | Promise<Record<string, unknown>>
}