import React, { useContext, useSyncExternalStore, useRef, ReactElement } from "react";
import FormContext from "./FormContext";
import CalculatorContext from "./CalculatorContext";
import ManageInstance from './ManageInstance';
import ToolTipContext from "./ToolTipContext";
import { DrawToolTipArgs } from "./CommonTypes";
import ToolTipsProps, { DefaultToolTipOptions } from "./ToolTipsProps";


function ToolTips(props: ToolTipsProps) {
	const { id, offsetTop, offsetLeft, absolute, needsOffset, x, y } = { ...props };
	const { toolTipData } = useContext(CalculatorContext);
	const ToolTip = useContext(ToolTipContext);
	const fc = useContext(FormContext);
	const w: ManageInstance<any> = fc.getSlotRefWatcher() || new ManageInstance(useRef(null));
	const slotRef = useSyncExternalStore(...w.subscribe()) as React.RefObject<HTMLDivElement>;

	if (!id || !toolTipData.hasOwnProperty(id) || !slotRef || !slotRef.current) return;
	const style: { [key: string]: any } = {}
	// YES THIS IS A FROZEN SHAPSHOT!
	const copy = { ...style, top: y, left: x }
	style.top = y! + offsetTop!
	style.left = x! + offsetLeft!;
	if (absolute) {
		style.position = 'absolute';


	}
	style.top += 'px'
	style.left += 'px'

	return <ToolTip id={id} toolTipData={toolTipData} style={style} />
}

function WatchTT(props: { m: ManageInstance<null | { [key: string]: any }> }) {
	const tt = useSyncExternalStore(...props.m.subscribe()) as ToolTipsProps;
	if (!tt) return '';
	return <ToolTips {...tt} />
}


function CreateTT(opts = DefaultToolTipOptions) {
	const safe = { ...DefaultToolTipOptions, ...(opts || {}) };
	const m: ManageInstance<any> = new ManageInstance(null);
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
