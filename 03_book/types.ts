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


export type LinesData = Array<{section:string, lines: Array<Array<string>>}>


export type ArticleData = {
  title: string,
  author: string,
  lines_data: LinesData
}


export type TextInfo = {
  title: string,
  subtitle: string,
  author: string,
  creator: string,
  revise: string,
  date: string,
  from: string,
  texts_data: Array<ArticleData>
}


export type SetViewProps = {
  route: string,
  path: string,
  save_file: boolean,
  handler?: () => Record<string, unknown> | Promise<Record<string, unknown>>
}


export type HomeProps = {
  titles_data: Array<{title:string, author:string}>,
  book_info: Omit<TextInfo, "texts_data">
}


export type PageProps = ArticleData | { title: null }


export type TextNodeInfo = {
  type: "text",
  text: string,
} | {
  type: "rubi",
  text: string,
  rubi: string,
}