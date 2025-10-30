import ManageInstance from "./ManageInstance";

export default interface ToggleFsProps {
  side?: number;
  title?: string;
  m: ManageInstance<React.RefObject<HTMLDivElement>>
}