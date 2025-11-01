// See:https://www.npmjs.com/package/gh-pages
import ReactDOM from 'react-dom/client';
import React from 'react';
import 'linked-bundle-node-map/dist/linked-bundle-node.css'
import MinimalDemo from './demos/MinimalDemo/MinimalDemo'

const maps: {[key:string]: ()=>React.ReactElement}={
	min: MinimalDemo,
};
const el = document.getElementById('app');
if (el !== null) {
	const root = ReactDOM.createRoot(el);
	const key=window.location.href.replace(/^.*\?demo=/,'');
	const Demo=maps.hasOwnProperty(key) ? maps[key] : MinimalDemo;

	root.render(<div style={{ width: '100%', height: '100%' }}>
		<Demo />
	</div>)
}
