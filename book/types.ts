export type ViewConfig = {
  SIZE: [number, number],
  CRIENT_PATH: string,
  GoogleFonts: Array<string>,
  TW_CONFIG: Record<string, unknown>,
  PORT: number,
}


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


export type HomeProps = {
  titles_data: Array<{title:string, author:string}>,
  book_info: Omit<TextInfo, "texts_data">
}


export type PageProps = ArticleData


export type setViewProps = {
  type: "home",
  data: HomeProps
} | {
  type: "page",
  data: PageProps
}


export type TextNodeInfo = {
  type: "text",
  text: string,
} | {
  type: "rubi",
  text: string,
  rubi: string,
}