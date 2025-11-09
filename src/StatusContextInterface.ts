import ManageInstance from './ManageInstance';
import CoreEvent from './CoreEvent';
import { MapChanges } from './CommonTypes';
interface StatusContextInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendEvent(event:CoreEvent<any>, data:MapChanges):void;
  getSlotRefWatcher():ManageInstance<React.RefObject<HTMLDivElement>>|undefined;
  setSlotRefWatcher(m:ManageInstance<React.RefObject<HTMLDivElement>>|undefined):void;
}

export default StatusContextInterface