import ManageInstance from './ManageInstance';
import CoreEvent from './CoreEvent';
import { MapChanges } from './CommonTypes';
interface StatusContextInterface {
  sendEvent(event:CoreEvent<any>, data:MapChanges):void;
  getSlotRefWatcher():ManageInstance<React.RefObject<HTMLDivElement>>|undefined;
  setSlotRefWatcher(m:ManageInstance<React.RefObject<HTMLDivElement>>|undefined):void;
}

export default StatusContextInterface