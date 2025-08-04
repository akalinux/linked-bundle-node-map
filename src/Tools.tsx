import React from "react";

export default function Tools(props: React.PropsWithChildren) {
  return <div className="ToolBarPosition"
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
    }}>
    <div className="relativeTag">{props.children}</div>
  </div>
}