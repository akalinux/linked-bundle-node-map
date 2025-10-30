import Compass from "./Compass";
import ZoomAndRestore from "./ZoomAndRestore";
import ToggleFullScreen from "./ToggleFullScreen";
import GridToggle from "./GridToggle";
import Search from "./Search";
import Tools from "./Tools";
import { createContext } from "react";

const defaultContext={
	Compass,
	ZoomAndRestore,
	ToggleFullScreen,
	GridToggle,
	Search,
	Tools
}

const ToolsContext=createContext(defaultContext);

export default ToolsContext;