import React,{ useContext } from "react"
import ThemeContext from "./ThemeContext"


export default function ZoomAndRestore(props:{ onClick:(arg:string)=>void }) {
  const {onClick}=props;
  const theme = useContext(ThemeContext)

  return <div>
    <div title={'Zoom In'} className={`ZoomButton ${theme}`} onClick={() => onClick('+')}>+</div>
    <div title={'Zoom Out'} className={`ZoomButton ${theme}`} onClick={() => onClick('-')}>-</div>
    <div title={'Undo Changes'} className={`ResetButton ${theme}`} onClick={() => onClick('r')}>Reset</div>
  </div>
}