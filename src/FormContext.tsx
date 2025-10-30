import { MapChanges, PointLookupResult } from './CommonTypes';
import { createContext } from 'react';
import ManageInstance from './ManageInstance';
import CoreEvent from './CoreEvent';
import StatusContextInterface from './StatusContextInterface';

class OnChange implements CoreEvent<MapChanges> {
	data: MapChanges;
	name = 'OnChange';
	tag: string;
	constructor(args: { data: MapChanges, tag: string }) {
		this.tag = args.tag;
		this.data = args.data;
	}
	getData() {
		return this.data as MapChanges;
	}
}

class OnClick implements CoreEvent<PointLookupResult> {
	data: PointLookupResult;
	name = 'OnClick';
	tag: string;
	constructor(args: { data: PointLookupResult, tag: string }) {
		this.tag = args.tag;
		this.data = args.data;
	}
	getData() {
		return this.data as PointLookupResult;
	}
}

class NodeChange extends OnClick {
	name='NodeChange';
}
class Reset implements CoreEvent<any> {
	data: any;
	name = 'Reset';
	tag: string;
	constructor(args: { data: any, tag: string }) {
		this.tag =args.tag;
		this.data = args.data;
	}
	getData() {
		return this.data;
	}
}


class LinkedMapStatus implements StatusContextInterface {
	m: ManageInstance<React.RefObject<HTMLDivElement>> | undefined;
	setSlotRefWatcher(m: ManageInstance<React.RefObject<HTMLDivElement>> | undefined) { this.m = m }
	getSlotRefWatcher() {
		return this.m;
	}
	sendEvent(event: CoreEvent<any>, data: MapChanges) { }
}

const FormContext: React.Context<StatusContextInterface> = createContext(new LinkedMapStatus() as StatusContextInterface);
export {
	OnChange,
	OnClick,
	NodeChange,
	Reset,
	LinkedMapStatus,
	type StatusContextInterface
}
export default FormContext;

