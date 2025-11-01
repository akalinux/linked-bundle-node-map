// See:https://www.npmjs.com/package/gh-pages
import ReactDOM from 'react-dom/client';
import React from 'react';
import 'linked-bundle-node-map/dist/linked-bundle-node.css'
import MinimalDemo from './demos/MinimalDemo'
const el = document.getElementById('app');
if (el !== null) {
	const root = ReactDOM.createRoot(el);

	root.render(<div style={{ width: '100%', height: '100%' }}>
		<MinimalDemo />
	</div>)
}
