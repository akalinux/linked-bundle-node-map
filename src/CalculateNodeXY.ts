import CalculatorBase from "./CalculatorBase";
import { PreNodeEl, NodeEl } from "./CommonTypes";
type XYMode = 'tiled' | 'spiral';
export default class CalculateNodeXY extends CalculatorBase {
  nodes: NodeEl[] = [];
  todo: PreNodeEl[][] = [];
  nodeDistance = 8;
  boxDistance = 4;
  mode: XYMode = 'tiled';
  tileBy = 4;

  processNodes(list: PreNodeEl[]) {
    const groups: { [key: string | number]: number } = {};
    const { todo } = this;
    let id = -1;
    for (let i = 0; i < list.length; ++i) {
      const node = list[i];
      const tc = typeof node.t;
      if (tc == 'number' || tc == 'string') {
        if (groups.hasOwnProperty(node.t)) {
          todo[groups[node.t]].push(node);
        } else {
          groups[node.t] = ++id;
          todo[id] = [node];
        }
      } else {
        ++id;
        todo[id] = [node];
      }
    }
    if (this.mode == 'tiled') {
      this.computeTiled();
    }
  }
  computeTiled() {
    const { nodes, todo } = this;
    const maxColumns = Math.floor(todo.length);
    let column = 0;
    let minY = 0;
    let minX = 0;
    const distance = this.r * this.nodeDistance;
    const pad = this.r * this.boxDistance;
    for (let id = 0; id < todo.length; ++id) {
      let maxY = minY;
      let maxX = 0;

      const list = todo[id];
      if (list.length > 1) {
        const r = this.computeRforEvenlySpacedPointsOnCircle(distance, list.length);
        const cx = r + minX + pad;
        const cy = r + minY + pad;
        const inc = 360 / list.length;
        for (let i = 0; i < list.length; ++i) {
          const node = { ...list[i] } as NodeEl;
          const { x, y } = this.getXY(cx, cy, r, inc * i);
          if (maxX < x) maxX = x;
          if (maxY < y) maxY = y;
          node.x = x;
          node.y = y;
          nodes.push(node);
        }
      } else {
        const node = { ...list[0] } as NodeEl;
        const x = minX = minX + pad;
        const y = minY + pad;
        node.x = x;
        node.y = y;
        nodes.push(node);
        if (maxX < x) maxX = x;
        if (maxY < y) maxY = y;
      }
      minX = maxX;
      if (++column >= maxColumns) {
        minX = 0;
        column = 0;
        minY = maxY + distance;
      }
    }
  }
}

