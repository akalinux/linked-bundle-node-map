import LinkedNodeMap, { FormContext, LinkedMapStatus, ThemeContext, SetCalculatorData , MergeMapChanges, MapChanges} from 'linked-bundle-node-map'
import React, { useState  } from 'react';
import RawData from '../ManualToolTipsAndBundles/data.json'
import '../MinimalDemo/min.css';

const clone = JSON.stringify(RawData);


export default function ThemeEventsReset() {

	let changes: MapChanges|null=null;
	const [theme, setTheme] = useState('light');
	const [data, setData] = useState(JSON.parse(clone) as SetCalculatorData);
	const fc = new LinkedMapStatus();
	fc.sendEvent = (event, mapChanges) => {
		console.log(event, mapChanges);
		if (event.name == 'Reset') {
			setData(JSON.parse(clone));
		}
		changes=mapChanges;
	}
	return <div className='container'>
		<div className='infoBlock'>
			<div>Linked Bundle NodeMap, Themese Events and Reset Support</div>
			<div>
				<div className='noBlock'>
					<ul>
						<li><a href="https://github.com/akalinux/linked-bundle-node-map/">Back to the githib prject</a></li>
						<li>
							<a href="https://github.com/akalinux/linked-bundle-node-map/blob/master/demo_app/src/demos/ThemeEventsReset/ThemeEventsReset.tsx">
								View this example's source
							</a>
						</li>
					</ul>
				</div>
				<div className='noBlock' style={{ marginLeft: "10px" }}>
					See the JavaScript console for example events.<br />
					Select A theme: <select value={theme} onChange={e => {
						if(changes!==null) MergeMapChanges(changes,data)
							console.log(data);
						setTheme(e.target.value);
					}} name="theme">
						<option value="light">light</option>
						<option value="dark">dark</option>
					</select>
				</div>
			</div>
		</div>
		<div className='mapContainer'>
			<ThemeContext.Provider value={theme}>
				<FormContext.Provider value={fc}>
					<LinkedNodeMap {...data} showReset={true} />
				</FormContext.Provider>
			</ThemeContext.Provider>
		</div>
	</div>
}

