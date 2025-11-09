import React, { useContext, useSyncExternalStore, useRef, ReactElement } from "react";
import FormContext from "./FormContext";
import CalculatorContext from "./CalculatorContext";
import ManageInstance from './ManageInstance';
import ToolTipContext from "./ToolTipContext";
import { DrawToolTipArgs } from "./CommonTypes";
import ToolTipsProps, { DefaultToolTipOptions } from "./ToolTipsProps";


function ToolTips(props: ToolTipsProps) {
	const { id, offsetTop, offsetLeft, absolute, x, y } = { ...props };
	const { toolTipData } = useContext(CalculatorContext);
	const ToolTip = useContext(ToolTipContext);
	const fc = useContext(FormContext);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const w: ManageInstance<any> = fc.getSlotRefWatcher() || new ManageInstance(useRef(null));
	const slotRef = useSyncExternalStore(...w.subscribe()) as React.RefObject<HTMLDivElement>;

	if (!id || !Object.hasOwnProperty.call(toolTipData,id) || !slotRef || !slotRef.current) return;
  
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const style: { [key: string]: any } = {}
	// YES THIS IS A FROZEN SHAPSHOT!
	style.top = y! + offsetTop!
	style.left = x! + offsetLeft!;
	if (absolute) {
		style.position = 'absolute';


	}
	style.top += 'px'
	style.left += 'px'

	return <ToolTip id={id} toolTipData={toolTipData} style={style} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WatchTT(props: { m: ManageInstance<null | { [key: string]: any }> }) {
	const tt = useSyncExternalStore(...props.m.subscribe()) as ToolTipsProps;
	if (!tt) return '';
	return <ToolTips {...tt} />
}


function CreateTT(opts = DefaultToolTipOptions) {
	const safe = { ...DefaultToolTipOptions, ...(opts || {}) };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const m: ManageInstance<any> = new ManageInstance(null);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const res: [(arg: DrawToolTipArgs) => void, ReactElement, ManageInstance<any>] = [
		(arg: DrawToolTipArgs) => {
			if (arg) {
				m.publish({ ...safe, ...(arg || {}) });
			} else {
				m.publish(arg);
			}
		},
		<WatchTT m={m} />,
		m
	];
	return res;
}

export default CreateTT;
