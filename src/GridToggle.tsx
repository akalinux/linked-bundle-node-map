/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{ useContext } from "react";
import CalculatorContext from "./CalculatorContext";

interface CoreToggleGrid {
  lineCount?:number;
  side?:number;
  title?:string;
  onClick?(): void;
}

const CORE_OPT:CoreToggleGrid = {
  lineCount: 3,
  side: 35,
  title: 'Toggle Background Grid On/Off',
  onClick: () => { },
}

const GridToggle:React.FC<CoreToggleGrid>=(props) => {
  const icalc = useContext(CalculatorContext);
  const { bgColor, lineColor } = icalc;
  const { side,  lineCount, onClick, title } = { ...CORE_OPT, ...props }
  const lines = [];

  const total = lineCount! + 1;
  const size = side! / total;
  const half = Math.round(total / 2);
  const lineWidth = size * .3;
  const ref:{[key:string]:any} = { strokeWidth: lineWidth, fill: 'none', stroke: lineColor };
  for (let id = 1; id < total; ++id) {
    let offset = 0;
    if (id < half) {
      offset = lineWidth * .5;
    } else if (id > half) {
      offset = lineWidth * -.5;
    }
    const calc = id * size + offset;
    // x axis
    ref.y1 = 0;
    ref.y2 = side;
    ref.x1 = calc;
    ref.x2 = calc;
    lines.push(<line key={id + 'x'} {...ref} />)
    // y axis
    ref.x1 = 0;
    ref.x2 = side;
    ref.y1 = calc;
    ref.y2 = calc;
    lines.push(<line key={id + 'y'} {...ref} />)
  }

  return (
    <div title={title} className="linked-node-map-svg-container">
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width={side + 'px'} height={side + 'px'}>
      <rect x="0" y="0" strokeWidth={lineWidth * 2} width={side} height={side} stroke={lineColor} fill={bgColor} />
      {lines}
    </svg>
    </div>
  )
}

export default GridToggle;
export { type CoreToggleGrid};

