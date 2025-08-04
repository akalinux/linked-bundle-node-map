import React, { useContext, useSyncExternalStore } from "react";
import CalculatorContext from "./CalculatorContext";
import ManageInstance from "./ManageInstance";

interface ToggleFsProps {
  side?: number;
  title?: string;
  m: ManageInstance<React.RefObject<HTMLDivElement>>
}

const CORE_OPT = {
  side: 35,
  title: 'Toggle Full Screen Mode On/Off',
}

const ToggleFullScreen: React.FC<ToggleFsProps> = (props) => {
  const { lineColor } = useContext(CalculatorContext);

  const { side, title, m } = { ...CORE_OPT, ...props }
  const wr = useSyncExternalStore(...m.subscribe());

  if (!wr) return;
  const onClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wr.current.requestFullscreen();
    }
  }

  return (
    <div title={title} style={{ width: side + 'px', height: side + 'px', border: 'solid 1px' }}>
      <svg viewBox="0 0 24 24" onClick={onClick} xmlns="http://www.w3.org/2000/svg"
        width={side + 'px'}
        height={side + 'px'} style={{ fill: lineColor }}>
        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V12H19V19Z" stroke={lineColor} fill={lineColor} />
      </svg>
    </div>
  )
}

export default ToggleFullScreen;

