import LinkedNodeMap from '../../src/LinkedBundleNodeMap'
import React from 'react';
import data from './MinimalDemo.json'

export default function MinimalDemo() {
	return <LinkedNodeMap {...data} />
}