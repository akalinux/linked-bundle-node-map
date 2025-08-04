import React, { useContext, useSyncExternalStore, useRef } from "react";
import FormContext from "./FormContext";
import CalculatorContext from "./CalculatorContext";
import ManageInstance from './ManageInstance';
import ToolTip from './ToolTip';
interface ToolTipsProps {
  id?: string;
  x?: number;
  y?: number;
  absolute: boolean;
  needsOffset: boolean;
  offsetLeft: number;
  offsetTop: number;
}

const DEFAULT_OPTIONS: ToolTipsProps = { absolute: true, needsOffset: true, offsetLeft: 0, offsetTop: 0 };
function ToolTips(props: ToolTipsProps) {
  const { id, offsetTop, offsetLeft, absolute, needsOffset, x, y } = { ...DEFAULT_OPTIONS, ...props };
  const { toolTipData } = useContext(CalculatorContext);
  const fc = useContext(FormContext);
  const w: ManageInstance<any> = fc.getSlotRefWatcher() || new ManageInstance(useRef(null));
  const slotRef = useSyncExternalStore(...w.subscribe()) as React.RefObject<HTMLDivElement>;

  if (!id || !toolTipData.hasOwnProperty(id) || !slotRef || !slotRef.current) return;
  const style: { [key: string]: any } = {}
  // YES THIS IS A FROZEN SHAPSHOT!
  const p = slotRef.current.getBoundingClientRect();
  style.top = y! + offsetTop
  style.left = x! + offsetLeft;
  if (absolute) {
    style.position = 'absolute';

    if (needsOffset) {
      style.top -= p.top;
      style.left -= p.left;
    }
  }
  style.top += 'px'
  style.left += 'px'

  const { label, data } = toolTipData[id]
  return <div style={style} key={id} >
    <ToolTip label={label} data={data} />
  </div>
}

function WatchTT(props: { m: ManageInstance<null | { [key: string]: any }> }) {
  const tt = useSyncExternalStore(...props.m.subscribe()) as ToolTipsProps;
  if (!tt) return;
  return <ToolTips {...tt} />
}


function CreateTT(opts = DEFAULT_OPTIONS) {
  const safe = { ...DEFAULT_OPTIONS, ...(opts || {}) };
  const m: ManageInstance<any> = new ManageInstance(null);
  return [(arg: { [key: string]: any } | undefined) => {
    if (arg) {
      m.publish({ ...safe, ...(arg || {}) });
    } else {
      m.publish(arg);
    }
  }, <WatchTT m={m} />, m]
}

export default CreateTT;
