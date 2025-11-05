import CalculatorBase from "./CalculatorBase";
import { NavIndex, ContainerBox, HasIdEl, NodeLinkChoice, Cordinate, IndexLookupResult } from "./CommonTypes";

interface IdxMaps { [key: string]: { x: number, y: number, i: number }[] }
export default class Indexer extends CalculatorBase {
  indexSize: number = 48;
  indexes: NavIndex = {};
  indexMap: { nodes: IdxMaps, links: IdxMaps } = { links: {}, nodes: {} };

  reset() {
    this.indexes = {};
    this.indexMap = { links: {}, nodes: {} };
  }

  buildIndexes(todo: { Cs: ContainerBox; target: NodeLinkChoice; obj: HasIdEl; }[]) {
    for (let i = 0; i < todo.length; ++i) {
      const { Cs, target, obj } = todo[i];
      this.indexBox(Cs, target, obj);
    }
  }

  cleaIndex(target: NodeLinkChoice, id: string) {
    const { indexMap, indexes } = this;
    if (!indexMap.hasOwnProperty(target)) return;
    const targets = indexMap[target];
    if (!targets.hasOwnProperty(id)) return;
    const todo = targets[id];
    delete targets[id];
    for (let idx = 0; idx < todo.length; ++idx) {
      const { x, y, i } = todo[idx];
      const yIdx = indexes[x][y][target];
      yIdx.splice(i, 1);

      if (indexes[x][y].links.length == 0 && indexes[x][y].nodes.length == 0) delete indexes[x][y];
      if (Object.keys(indexes[x]).length == 0) delete indexes[x];
    }
  }

  indexBox(Cs: ContainerBox, target: NodeLinkChoice, obj: HasIdEl) {
    //const { Cs, target, obj } = indexTodo[tid];
    const { ne, nw, se, sw } = Cs;
    let minX = ne.x, maxX = ne.x, maxY = ne.y, minY = ne.y;
    const list = [nw, se, sw];
    for (let i = 0; i < 3; ++i) {
      const c = list[i];
      if (c.x < minX) minX = c.x
      if (c.y < minY) minY = c.y
      if (c.x > maxX) maxX = c.x
      if (c.y > maxY) maxY = c.y
    }
    const sx = Math.round(minX);
    const ex = Math.round(maxX)
    const { indexSize, indexes, indexMap } = this;
    const startX = sx - sx % indexSize;
    const endX = ex - ex % indexSize;
    const sy = Math.round(minY);
    const ey = Math.round(maxY);
    const startY = sy - sy % indexSize;
    const endY = ey - ey % indexSize;
    for (let x = startX; x <= endX; x += indexSize) {
      const index = indexes[x] || (indexes[x] = {});
      for (let y = startY; y <= endY; y += indexSize) {
        const set = index[y] || (index[y] = { nodes: [], links: [] });
        set[target] || (set[target] = []);
        let idx = set[target].push(obj.i) - 1;
        const list = indexMap[target][obj.i] || (indexMap[target][obj.i] = []);
        list.push({ x, y, i: idx });
      }
    }
  }

  lookup(p: Cordinate) {
    const { indexSize, indexes } = this;
    const rx = Math.round(p.x);
    const x = rx - rx % indexSize;
    if (!indexes.hasOwnProperty(x)) return null;
    const idx = indexes[x];
    const ry = Math.round(p.y);
    const y = ry - ry % indexSize;
    if (!idx.hasOwnProperty(y)) return null;
    return idx[y] as IndexLookupResult;
  }
}


