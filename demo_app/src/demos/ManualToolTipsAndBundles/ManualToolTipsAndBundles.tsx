import LinkedNodeMap from 'linked-bundle-node-map'
import React from 'react';
import data from './data.json'
import '../MinimalDemo/min.css';
export default function ManualToolTipsAndBundles() {

	return <div className='container'>
	<div className='infoBlock'>
	  <div>Linked Bundle NodeMap, Manual Tool tips and Bundles</div>
		<ul>
		  <li><a href="https://github.com/akalinux/linked-bundle-node-map/">Back to the githib project</a></li>
		  <li>
			<a href="https://github.com/akalinux/linked-bundle-node-map/blob/master/demo_app/src/demos/ManualToolTipsAndBundles/ManualToolTipsAndBundles.tsx">
			  View this example's source
			</a>
			</li>
		</ul>
		</div>
	<div className='mapContainer'><LinkedNodeMap {...data} /></div>
	</div>
}
