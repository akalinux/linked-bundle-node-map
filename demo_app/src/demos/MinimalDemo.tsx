import LinkedNodeMap from 'linked-bundle-node-map'
import React from 'react';
import data from './MinimalDemo.json'

export default function MinimalDemo() {
	return <LinkedNodeMap {...data} />
}