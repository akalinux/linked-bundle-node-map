import { useContext } from "react"
import ThemeContext from "./ThemeContext"


export default function ZoomAndRestore(props:{ onClick:(arg:string)=>void }) {
  const {onClick}=props;
  const theme = useContext(ThemeContext)

  return <div>
    <div title={'Zoom In'} className={`linked-node-map-ZoomButton linked-node-map-${theme}`} onClick={() => onClick('+')}>+</div>
    <div title={'Zoom Out'} className={`linked-node-map-ZoomButton linked-node-map-${theme}`} onClick={() => onClick('-')}>-</div>
    <div title={'Undo Changes'} className={`linked-node-map-ResetButton linked-node-map-${theme}`} onClick={() => onClick('r')}>Reset</div>
  </div>
}