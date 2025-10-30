import { createContext } from "react";
import ToolTip from './ToolTip';
import { ToolTipData } from "./CommonTypes";
interface ToolTipRenderProps {
	style: {[key:string]:any};
	id: string;
	toolTipData: ToolTipData;
}

function ToolTipRender(props: ToolTipRenderProps) {
	const { id, style } =props;

	const {label,data}=props.toolTipData[id];
	return <div style={style}>
	  <ToolTip label={label} data={data} />
	</div>
}

const ToolTipContext=createContext(ToolTipRender);
export default ToolTipContext;