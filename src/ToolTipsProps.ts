export default interface ToolTipsProps {
  id?: string;
  x?: number;
  y?: number;
  absolute: boolean;
  needsOffset: boolean;
  offsetLeft?: number;
  offsetTop?: number;
}
const DefaultToolTipOptions: ToolTipsProps = { 
	absolute: true, 
	needsOffset: true, 
	offsetLeft: 5, 
	offsetTop: 0,  
};
export { DefaultToolTipOptions }