import { MapChanges } from './CommonTypes'
import { SetCalculatorData } from './Calculator';
export default function MergeMapChanges(changes: MapChanges, data: SetCalculatorData) {
	const { nodes, transform, grid } = data;
	const nc = changes.nodes;
	for (let id = 0; id < nodes.length; ++id) {
		const node = nodes[id];
		const { i } = node;
		if (nc.hasOwnProperty(i)) {
			node.x = nc[i].x;
			node.y = nc[i].y;
		}
	}
	data.transform = transform;
	data.grid = grid;
}