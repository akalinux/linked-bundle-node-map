import React from "react";
import ThemeContext from "./ThemeContext";
export default function Tools(props: React.PropsWithChildren) {
	const theme=React.useContext(ThemeContext);
	
  return <div className={`linked-node-map-ToolBarPosition linked-node-map-${theme}`}
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
    }}>
    <div className="linked-node-map-relativeTag">{props.children}</div>
  </div>
}