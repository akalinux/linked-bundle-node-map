import LinkedNodeMap from 'linked-bundle-node-map'
import React from 'react';
import data from './MinimalDemo.json'
import './min.css';
export default function MinimalDemo() {

	return <div className='container'>
	<div className='infoBlock'>Linked Bundle NodeMap Minimal Demo</div>
	<div className='mapContainer'><LinkedNodeMap {...data} /></div>
	</div>
}