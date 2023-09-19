export type ViewConfig = {
  TITLE: string,
  SIZE: [number, number],
  CRIENT_PATH: string,
  GOOGLE_FONTS?: Array<string>,
  TW_CONFIG?: Record<string, unknown>,
  USE_WORKER: boolean,
  PORT: number,
}


export type SetViewProps = {
  route: string,
  save_file: boolean,
  props_setter?: () => Record<string, unknown> | Promise<Record<string, unknown>>,
  import_map_url?: string,
}

// --------------------------------------------------

export type AppProps = {
  titles: Array<string>,
  max_len: number,
}


export type Info = {page_idx:number, title: string, text:string}


export type HomeProps = {
  titles: Array<string>,
  max_len: number,
}


export type PageProps = {
  info: Info,
  max_len: number,
}