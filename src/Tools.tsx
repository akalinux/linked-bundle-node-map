import React from "react";

export default function Tools(props: React.PropsWithChildren) {
  return <div className="linked-node-map-ToolBarPosition"
    onClick={e => {
      e.preventDefault();
      e.stopPropagation();
    }}>
    <div className="linked-node-map-relativeTag">{props.children}</div>
  </div>
}