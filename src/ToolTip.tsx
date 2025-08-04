import React from 'react';
export default function DefaultToolTip(props:{ label:string, data?:string[] }) {
  const {label,data}=props;
  return <div className="Tooltip">
    <div className="TooltipHeading">{label}</div>
    {(data || []).map((text, idx) => {
      return <div className='TooltipRow' key={idx}>{text}</div>
    })}
  </div>
}