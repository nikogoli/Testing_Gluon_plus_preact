export type ViewConfig = {
  SIZE: [number, number],
  CRIENT_PATH: string,
  GoogleFonts: Array<string>,
  TW_CONFIG: Record<string, unknown>,
  PORT: number,
}


export type setViewProps = {
  type: "home",
  url: string,
}