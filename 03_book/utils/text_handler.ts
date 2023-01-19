import { TextNodeInfo } from "../types.ts"


export function replace_unicode(line:string){
  let new_line = line
  if (new_line.includes("[U+")){
    Array.from([...new_line.matchAll(/\[U\+(.{4})\]/g)]).forEach(([word, point]) => {
      new_line = new_line.replace(word, String.fromCodePoint(Number(`0x${point}`)))
    })
  }
  if (new_line.includes("――")){ new_line = new_line.replaceAll("――", "——") }
  return new_line
}


function handle_lines(lines_list:Array<Array<string>>){
  return lines_list.map(lines => {
    return lines.map(l => {
      const new_l = replace_unicode(l)
      
      let is_rubi_mode = false
      let target_type:"kanji"|"eigo"|null = null
      const LIST:Array<Array<string>> = [[]]
      const reversed = Array.from(new_l).reverse()
      
      reversed.forEach((word, idx) => {
        if (!is_rubi_mode){
          if (word == "》"){
            target_type = null
            is_rubi_mode = true
            LIST.push([word])
            return
          } else {
            LIST.at(-1)!.push(word)
            return
          }
        } else {
          if (target_type){
            if (word == "》"){
              target_type = null
              is_rubi_mode = true
              LIST.push([word])
              return
            }
            else if (
              (target_type=="eigo" && word != "｜" && word.match(/[^a-zA-Z \u{00A1}\u{00BF}-\u{016B}]/mu)) ||
              (target_type=="kanji" && word != "々" && word.match(/[\u{3000}-\u{301C}\u{3041}-\u{3093}\u{309B}-\u{309E}—「]/mu) )
            ){
              if (target_type == "eigo"){
                LIST.push([" "])
                LIST.at(-1)!.push(word)
              } else {
                LIST.push([word]) 
              }
              target_type = null
              is_rubi_mode = false
              return
            }
            else if (word == "｜" || idx == reversed.length -1){
              target_type = null
              is_rubi_mode = false
              if (word != "｜"){ LIST.at(-1)!.push(word)}
              LIST.push([])
              return
            }
            else {
              LIST.at(-1)!.push(word)
              return
            }
          }
          else if (word == "《"){
            target_type = reversed.at(idx+1)!.match(/[a-zA-Z]/) ? "eigo" : "kanji"
          }
          LIST.at(-1)!.push(word)
          return
        }
      })
      return LIST.filter(x => x.length > 0).map(l => l.reverse().join("")).reverse()
    })
  })
}


export function handle_rubi(
  lines_list:Array<Array<string>>
):Array<Array<Array<TextNodeInfo>>> {
  const splited = handle_lines(lines_list)
  const out: Array<Array<Array<TextNodeInfo>>> = splited.map(lines => {
    return lines.map(line_elems => {
      return line_elems.map(elem => {
        if (elem.includes("《")){
          const [text, rubi] = elem.slice(0,-1).split("《")
          return { type: "rubi", text, rubi}
        } else {
          return { type: "text", text: elem }
        }
      })
    })
  })
  return out
}