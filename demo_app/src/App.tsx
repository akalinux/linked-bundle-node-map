// See:https://www.npmjs.com/package/gh-pages
import ReactDOM from 'react-dom/client';
import React, { StrictMode } from 'react';
import 'linked-bundle-node-map/dist/linked-bundle-node.css'
import MinimalDemo from './demos/MinimalDemo/MinimalDemo';
import ManualToolTipsAndBundles from './demos/ManualToolTipsAndBundles/ManualToolTipsAndBundles';
import ThemeEventsReset from './demos/ThemeEventsReset/ThemeEventsReset';
import GenerateXY from './demos/GenerateXY/GenerateXY';

const maps: { [key: string]: () => React.ReactElement } = {
	min: MinimalDemo,
	ttb: ManualToolTipsAndBundles,
	theme_reset_event: ThemeEventsReset,
  genXY: GenerateXY,
};
const el = document.getElementById('app');
if (el !== null) {
	const root = ReactDOM.createRoot(el);
	const key = window.location.href.replace(/^.*\?demo=/, '');
	const Demo = maps.hasOwnProperty(key) ? maps[key] : MinimalDemo;

	root.render(<StrictMode>
		<div style={{ width: '100%', height: '100%' }}>
			<Demo />
		</div>
	</StrictMode>)
}
