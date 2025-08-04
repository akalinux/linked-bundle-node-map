import React, { useContext, useRef, useEffect, useSyncExternalStore } from "react";
import ManageInstance from './ManageInstance';
import ThemeContext from "./ThemeContext";

const GRID_OPTS = {
  lineWidth: .5,
  gridSize: 15,
  gridSlots: 5,
  dark: '#adadb2',
  light: '#adadb2',
  dividerWidth: 1.5,
  width: 1920,
  height: 1080,
}

interface RenderCanvasProps {
  m: ManageInstance<null | HTMLCanvasElement>;
  lineWidth: number;
  gridSize: number;
  gridSlots: number;
  dark: string;
  light: string;
  dividerWidth: number;
  width: number;
  height: number;
}

const drawLine = (context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, w: number) => {
  context.beginPath();
  context.lineWidth = w;

  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.stroke();
};

const RenderCanvas: React.FC<RenderCanvasProps> = (props) => {
  const { dividerWidth, lineWidth, gridSize, gridSlots, width, height, m, light, dark } = props;
  const canvas = useSyncExternalStore(...m.subscribe());
  const theme = useContext(ThemeContext);
  if (!canvas) return;
  const tm: { [key: string]: string } = { light, dark };

  const context = canvas.getContext("2d");
  if(!context) return;
  
  context.clearRect(0, 0, width, height)
  context.globalAlpha = 1;
  context.strokeStyle = tm[theme];
  const incX = gridSize;
  let slot = 0;
  for (let x = incX; x < width; x += incX) {
    const x1 = x;
    const pos = ++slot % gridSlots;
    const w = pos == 0 ? dividerWidth : lineWidth;
    drawLine(context, x1, 0, x1, height, w);
  }
  const incY = gridSize;
  slot = 0;
  for (let x = incY; x < height; x += incY) {
    const y1 = x;
    const pos = ++slot % gridSlots;
    const w = pos == 0 ? dividerWidth : lineWidth;
    drawLine(context, 0, y1, width, y1, w);
  }
  return '';
}

const STYLE = { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
export default function Grid(inArgs = GRID_OPTS) {
  const props = { ...GRID_OPTS, ...inArgs };
  const style: { [key: string]: any } = { ...STYLE }
  const ref: React.RefObject<null | HTMLCanvasElement> = useRef(null);
  const m: ManageInstance<null | HTMLCanvasElement> = new ManageInstance(ref.current);
  useEffect(() => {
    ref && ref.current ? m.publish(ref.current) : m.publish(null)
  }, [ref])
  return <>
    <canvas style={style} width={props.width} height={props.height} ref={ref} />
    <RenderCanvas {...props} m={m} />
  </>
}

