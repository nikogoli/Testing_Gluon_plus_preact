
import IconHome from "tabler_icons_tsx/tsx/home.tsx"
import IconSquareRoundedArrowLeft from "tabler_icons_tsx/tsx/square-rounded-arrow-left.tsx"
import IconSquareRoundedArrowRight from "tabler_icons_tsx/tsx/square-rounded-arrow-right.tsx"


export default function MovePageButtons(props:{ idx:number }){
  return(
    <div class="p-1 border-2 rounded-xl flex gap-2" style={{height: "fit-content"}}>
        { props.idx > 1
            ? <a href={`/page/${ props.idx-1}`}>
                <IconSquareRoundedArrowLeft class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
              </a>
            : <IconSquareRoundedArrowLeft class="text-[#737373]" size={30} stroke-width={"1px"}/>
        }
        <a href={"/"}>
          <IconHome class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
        </a>
        { props.idx < 5
            ? <a href={`/page/${ props.idx+1}`}>
                <IconSquareRoundedArrowRight class="text-[#2563eb]" size={30} stroke-width={"1px"}/>
              </a>
            : <IconSquareRoundedArrowRight class="text-[#737373]" size={30} stroke-width={"1px"}/>
        }
      </div>
  )
}