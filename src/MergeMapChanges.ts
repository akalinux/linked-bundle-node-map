import { MapChanges } from './CommonTypes'
import { SetCalculatorData } from './Calculator';
export default function MergeMapChanges(changes: MapChanges, data: SetCalculatorData, autoFit: boolean = false) {

	const { nodes, transform, grid, tick } = changes;
	const dn = data.nodes;
	for (let id = 0; id < dn.length; ++id) {
		const node = dn[id];
		const { i } = node;
		if (nodes.hasOwnProperty(i)) {
			node.x = nodes[i].x;
			node.y = nodes[i].y;
		}
	}
	data.autoFit = autoFit;
	data.transform = transform;
	data.grid = grid;
	data.tick = tick;
}