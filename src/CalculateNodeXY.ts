import CalculatorBase from "./CalculatorBase";
import { PreNodeEl, NodeEl } from "./CommonTypes";
type XYMode = 'tiled' | 'spiral';
export default class CalculateNodeXY extends CalculatorBase {
  nodes: NodeEl[] = [];
  todo: PreNodeEl[][] = [];
  nodeDistance = 8;
  boxDistance = 4;
  mode: XYMode = 'tiled';
  ratio = 16/9;

  processNodes(list: PreNodeEl[]) {
    const groups: { [key: string | number]: number } = {};
    const { todo } = this;
    let id = -1;
    for (let i = 0; i < list.length; ++i) {
      const node = list[i];
      const t=node.t
      const tc = typeof t;
      if (tc == 'number' || tc == 'string') {
        if (Object.prototype.hasOwnProperty.call(groups,t)) {
          todo[groups[t]].push(node);
        } else {
          groups[t] = ++id;
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
    const maxColumns = Math.ceil(Math.sqrt(todo.length) * this.ratio);
    let column = 0;
    let minY = 0;
    let minX = 0;
    let maxY = 0;
    const distance = this.r * this.nodeDistance;
    const pad = this.r * this.boxDistance;
    for (let id = 0; id < todo.length; ++id) {
      let maxX = 0;

      const list = todo[id];
      if (list.length > 1) {
        const r = this.computeRforEvenlySpacedPointsOnCircle(distance, list.length);
        const cx = r + minX + pad;
        const cy = r + minY + pad;
        const inc = 360 / list.length;
        for (let i = 0; i < list.length; ++i) {
          const { x, y } = this.getXY(cx, cy, r, inc * i);
          const node = { ...list[i], x, y } as NodeEl;
          if (maxX < x) maxX = x;
          if (maxY < y) maxY = y;
          nodes.push(node);
        }
      } else {
        const x = minX = minX + pad;
        const y = minY + pad;
        const node = { ...list[0], x, y } as NodeEl;
        nodes.push(node);
        if (maxX < x) maxX = x;
        if (maxY < y) maxY = y;
      }
      minX = maxX;
      if (++column >= maxColumns) {
        minX = 0;
        column = 0;
        minY = maxY;
      }
    }
  }
}

