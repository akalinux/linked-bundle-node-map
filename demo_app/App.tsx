// See: https://github.com/facebook/create-react-app/tree/main/packages/cra-template/template
import ReactDOM from 'react-dom/client';
import React from 'react';
import LinkedNodeMap, { FormContext,LinkedMapStatus } from '../src/LinkedBundleNodeMap'
import RawData from './data.json'
const el = document.getElementById('app');
import '../src/LinkedSet.css'
import CoreEvent from '../src/CoreEvent';
import { MapChanges } from '../src/CommonTypes';
import { SetCalculatorData } from '../src/Calculator';
const original=JSON.stringify(RawData);
const PassRef = () => {
	const ref = React.useRef<HTMLDivElement>(null);
	const  [data,setData]=React.useState<SetCalculatorData>(JSON.parse(original));
	

	const fc=new LinkedMapStatus();
	const sendEvent = (event: CoreEvent<any>, changes: MapChanges) => {
		if(event.tag ==='reset') {
			setData(JSON.parse(original));
		}
		console.log(event,changes);
	}
	fc.sendEvent=sendEvent;

	return <FormContext.Provider value={fc}>
		<LinkedNodeMap {...data} ref={ref} />
	</FormContext.Provider>
}
if (el !== null) {

	const root = ReactDOM.createRoot(el);

	root.render(<div style={{ width: '100%', height: '100%' }}>
		<PassRef />
	</div>)
}
