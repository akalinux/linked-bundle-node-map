export default function DefaultToolTip(props:{ label:string, data?:string[] }) {
  const {label,data}=props;
  return <div className="linked-node-map-Tooltip">
    <div className="linked-node-map-TooltipHeading">{label}</div>
    {(data || []).map((text, idx) => {
      return <div className='linked-node-map-TooltipRow' key={idx}>{text}</div>
    })}
  </div>
}