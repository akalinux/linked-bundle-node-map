import CalculatorBase from "./CalculatorBase";
import { ContainerBox, HasIdEl, NodeLinkChoice, Cordinate, IndexLookupResult,IndexSet } from "./CommonTypes";

interface XYISet {x:number,y:number,i:number}

export default class Indexer extends CalculatorBase {
  indexSize: number = 48;
  indexes: Map<number,Map<number,IndexSet>>=new Map<number,Map<number,IndexSet>>
  indexMap: { nodes: Map<string,XYISet[]>, links:  Map<string,XYISet[]> } = { links: new  Map<string,XYISet[]>, nodes: new  Map<string,XYISet[]> };

  reset() {
    this.indexes = new Map<number,Map<number,IndexSet>>
    this.indexMap = { links: new  Map<string,XYISet[]>, nodes: new  Map<string,XYISet[]> };
  }

  buildIndexes(todo: { Cs: ContainerBox; target: NodeLinkChoice; obj: HasIdEl; }[]) {
    for (let i = 0; i < todo.length; ++i) {
      const { Cs, target, obj } = todo[i];
      this.indexBox(Cs, target, obj);
    }
  }

  clearIndex(target: NodeLinkChoice, id: string) {
    const { indexMap, indexes } = this;
    if (!Object.hasOwnProperty.call(indexMap, target)) return;
    const targets = indexMap[target];
    if (!targets.has(id)) return;
    const todo = targets.get(id)!;
    targets.delete(id)
    for (let idx = 0; idx < todo.length; ++idx) {
      const { x, y, i } = todo[idx];
      const yIdx = indexes.get(x)!.get(y)![target];
      yIdx.splice(i, 1);

      if (indexes.get(x)!.get(y)!.links.length == 0 && indexes.get(x)!.get(y)!.nodes.length == 0) indexes.get(x)!.delete(y);
      if (indexes.get(x)!.size == 0) indexes.delete(x);
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
      if(!indexes.has(x)) {
        indexes.set(x,new Map<number,IndexSet>)
      }
      const index =indexes.get(x)!

      for (let y = startY; y <= endY; y += indexSize) {

        let set!: IndexSet
        if(!index.has(y)) {
          set={nodes:[],links:[]}
          index.set(y,set)
        } else {
          set=index.get(y)!
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        set[target] || (set[target] = []);
        const idx = set[target].push(obj.i) - 1;
        if(!indexMap[target].has(obj.i)) {
          indexMap[target].set(obj.i,[])
        }
        
        indexMap[target].get(obj.i)!.push({ x, y, i: idx });
      }
    }
  }

  lookup(p: Cordinate) {
    const { indexSize, indexes } = this;
    const rx = Math.round(p.x);
    const x = rx - rx % indexSize;
    if (!indexes.has(x)) return null;
    const idx = indexes.get(x)!
    const ry = Math.round(p.y);
    const y = ry - ry % indexSize;
    return idx.has(y) ? idx.get(y)! as IndexLookupResult : null
  }
}


