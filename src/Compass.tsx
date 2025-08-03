import React, { useState, useContext } from "react";
import CalculatorContext from "./CalculatorContext";
interface CompassProps {
  side?: number;
  onClick?(key: string): void;
  cStyle?: { [key: string]: any };
  title?: string;
}

const CORE_PROPS: CompassProps = {
  side: 35,
  onClick: (key: string) => { },
  cStyle: { cursor: 'pointer' },
  title: "Move and Center the Map",
}


const CLICKMAP: string[] = ['n', 'e', 's', 'w'];
const Compass:React.FC<CompassProps>=(props = CORE_PROPS) =>{

  const icalc = useContext(CalculatorContext);
  const [mouseOver, setMouseOver] = useState(-1);
  const { lineColor, fillColor, mouseOverColor } = icalc;
  const { side, onClick, cStyle, title } = { ...CORE_PROPS, ...props };
  const lineWidth = side! * .0725;
  const mid = side! * .5;
  const r = mid * .3;
  const top = .15 * mid;
  const left = mid - r;
  const right = mid + r;
  const bottom = mid * .57;
  const points = `${left},${bottom} ${right},${bottom} ${mid},${top}`
  const list = [];

  for (let id = 0; id < 4; ++id) {
    const rotate = 90 * id;
    const transform = `rotate(${rotate},${mid},${mid})`;
    const onMouseEnter = () => setMouseOver(id);
    const onMouseLeave = () => setMouseOver(-1);
    const fill = mouseOver == id ? mouseOverColor : "none";
    const click = () => onClick!(CLICKMAP[id]);
    list.push(
      <polygon
        key={id}
        onClick={click}
        style={cStyle}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        points={points}
        transform={transform}
        fill={fill} stroke={lineColor}
        strokeWidth={lineWidth} />
    )
  }
  const fill = mouseOver == -2 ? mouseOverColor : "none";
  const onMouseEnter = () => setMouseOver(-2);
  const onMouseLeave = () => setMouseOver(-1);
  return <div title={title}>
    <svg xmlns="http://www.w3.org/2000/svg" width={side + 'px'} height={side + 'px'}>
      <circle cx="50%" cy="50%" r="48.2%" fill={fillColor} stroke={lineColor} strokeWidth={lineWidth} />
      {list}
      <circle
        onClick={() => onClick!('c')}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        style={cStyle}
        cx="50%"
        cy="50%"
        r={r}
        fill={fill}
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
    </svg>
  </div>
}

export default Compass;

