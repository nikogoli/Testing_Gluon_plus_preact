import { LinesData } from "../../types.ts"

const texts = await Deno.readTextFile("raw_texts.txt").then(tx => tx.split("NEW"))

const INFO = await Deno.readTextFile("info.json").then(tx => JSON.parse(tx))
const OUT: Array<{title:string, author:string, lines_data:LinesData}> = []

texts.slice(1).forEach(tx => {
  const [_NEW, title_tx, author_tx, ...raw_lines] = tx.split("\r\n")
  //console.log(tx)
  const title = title_tx.replace("TITLE:", "")
  const author = author_tx.replace("AUTHOR:", "")
  const section = raw_lines[0].startsWith("# ") ? raw_lines[0].replace("# ", "") : "TOP"
  const lines_data: LinesData = [{section, lines: [[]]}]
  const lines = raw_lines[0].startsWith("# ") ? raw_lines.slice(1) : [...raw_lines]
  lines.reduce( (data, l, idx) => {
    if (l.startsWith("# ")){
      data.push({section: l.replace("# ", ""), lines:[[]]})
      return data
    } else {
      if (l.startsWith("> ")){
        if (data.some(x => x.section == "QUOTE")){
          data.find(x => x.section == "QUOTE")!.lines.at(-1)!.push(l.replace("> ", ""))
        } else {
          (idx == 0)
            ? data.unshift({section:"QUOTE", lines: [[l.replace("> ", "")]]})
            : data.push({section:"QUOTE", lines: [[l.replace("> ", "")]]})
          console.log(data)
        }
      }
      else if (l === ""){
        if (data.at(-1)!.lines.at(-1)!.length > 0){
          data.at(-1)!.lines.push([])
        }
        if (idx == lines.length-1 && data.at(-1)!.lines.at(-1)!.length == 0){
          data.at(-1)!.lines!.pop()
        }
      }
      else{
        if (data.at(-1)!.lines.at(-1) == undefined){ console.log(data.at(-1)) }
        data.at(-1)!.lines.at(-1)!.push(l)
      }
      return data
    }
  }, lines_data)
  OUT.push({title, author, lines_data})
})

INFO["text"] = OUT

await Deno.writeTextFile("info.json", JSON.stringify(INFO, null, 2))