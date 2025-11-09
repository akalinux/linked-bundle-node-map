/* eslint-disable @typescript-eslint/no-explicit-any */
import Calculator from "../src/Calculator"

it('basic instance creation', () => {
  const sl = new Calculator();
  expect(sl).toBeInstanceOf(Calculator);
});

it('link box test', () => {
  const sl = new Calculator();

  const res = sl.createLinkBox({ x: 1, y: 1 }, { x: 1, y: 2 }, 1);
  console.log(res);
  expect(res.ne.x).toBeCloseTo(2);
  expect(res.nw.x).toBeCloseTo(0);
  expect(res.ne.y).toBeCloseTo(1);
  expect(res.nw.y).toBeCloseTo(1);

  expect(res.se.x).toBeCloseTo(2);
  expect(res.sw.x).toBeCloseTo(0);
  expect(res.se.y).toBeCloseTo(2);
  expect(res.sw.y).toBeCloseTo(2);
})

it('inside box testing', () => {
  const sl = new Calculator();
  const box = {
    nw: { x: 1, y: 1 },
    ne: { x: 2, y: 1 },
    se: { x: 2, y: 2 },
    sw: { x: 1, y: 2 },
  }
  // Center of the box
  expect(sl.insideBox(box, { x: 1.5, y: 1.5 })).toBeTruthy();
  // left of the box
  expect(sl.insideBox(box, { x: 0, y: 1.5 })).toBeFalsy();
})

it('node box test', () => {

  const sl = new Calculator();
  const o = sl.createNodeBox({ x: 1, y: 1 }, 1);
  console.log(o);
  expect(o.ne.x).toBe(2)
  expect(o.se.x).toBe(2)
  expect(o.nw.x).toBe(0)
  expect(o.sw.x).toBe(0)

  expect(o.ne.y).toBe(0)
  expect(o.nw.y).toBe(0)
  expect(o.se.y).toBe(2)
  expect(o.sw.y).toBe(2)
})

it('line progress set', () => {
  const sl = new Calculator();
  let o = sl.computeLinePoint(
    { x: 0, y: 0 },
    5, 0, 1, 0);
  expect(o.x).toBeCloseTo(2.5);
  expect(o.y).toBeCloseTo(0);
  o = sl.computeLinePoint(
    { x: 0, y: 0 },
    5, 0, 3, 0);
  expect(o.x).toBeCloseTo(1.25);
  expect(o.y).toBeCloseTo(0);
  o = sl.computeLinePoint(
    { x: 0, y: 0 },
    5, 0, 3, 1);
  expect(o.x).toBeCloseTo(2.50);
  expect(o.y).toBeCloseTo(0);
})

it('inside square test', () => {
  const sl = new Calculator();
  expect(sl.insideSquare({ x: 1, y: 1 }, { x: 1, y: 1 }, 1)).toBeTruthy();
  expect(sl.insideSquare({ x: 1, y: 1 }, { x: .5, y: .5 }, 1)).toBeTruthy();
  expect(sl.insideSquare({ x: 1, y: 1 }, { x: -.1, y: 0 }, 1)).toBeFalsy();
})

it('inside circle test', () => {
  const sl = new Calculator();
  expect(sl.insideCircle({ x: 1, y: 1 }, { x: 1, y: 1 }, 1)).toBeTruthy();
  expect(sl.insideCircle({ x: 1, y: 1 }, { x: 0, y: 0 }, 1)).toBeFalsy();
})

it('validate data strucutre tests', () => {
  const sl = new Calculator();
  const srcNodes = [
    {
      i: "0",
      o: 'default',
      x: 1,
      y: 1,
      l: 'xx'
    },
    {
      i: "1",
      o: 'default',
      x: 1,
      y: 1,
      l: 'xx'
    }
  ];
  const srcLinks = [
    {
      i: "1",
      s: "0",
      d: "1",
      a: 's',
      b: ['test-bundle'],
      o: "1",
    },
    {
      i: "0",
      s: "1",
      d: "0",
      a: 'd',
      b: ['test-bundle'],
      o: "1",
    }];
  sl.linkOpts = {
    1: { c: "1" }
  }
  sl.nodeOpts = { default: { i: "1", c: 'x' } }
  let error:any = false;
  try {
    sl.setData({
        nodes: srcNodes, links: srcLinks,

    })
  } catch (e) {
    error = e;
  }
  console.log('nodes',sl.nodes)
  console.log('links',sl.links)
  //console.log('nodeLinks',sl.nodeLinks)
  expect(error).toBeFalsy();
  expect(Object.keys(sl.links).length==1).toBeTruthy();
})

it('index builder test',()=>{
  const sl:Calculator=new Calculator();
  sl.setR(1.25);
  expect(sl.indexSize).toBe(5);
  let node=sl.createNodeBox({x:2.5,y:2.5},1);
  sl.buildIndex(node,'nodes',{i:'test-node'});
	sl.needsIndexing=true;
  console.log(sl.indexer.indexes)
  let check=sl.getIndex({x:0,y:0});
  console.log(check)
  expect(check).not.toBeNull();
  console.log(check)
  expect(sl.getIndex({x:10,y:10}).links).not.toBeDefined();

  node=sl.createNodeBox({x:2.5,y:2.5},10);
  sl.buildIndex(node,'nodes',{i:'test-node'});
	sl.needsIndexing=true;

  check=sl.getIndex({x:0,y:0});
  expect(check.nodes!).toBeDefined();
  console.log(check);
  expect(check.nodes!.length).toBe(2);
  check=sl.getIndex({x:10,y:10});
  expect(check).not.toBeNull();
  expect(check.nodes!.length).toBe(1);
  check=sl.getIndex({x:100,y:100});
  expect(check.nodes).not.toBeDefined();
})

it('link size calculator',()=>{
  const sl = new Calculator();
  sl.boxWidth=10;
  expect(sl.getLineWith(1)).toBeCloseTo(10/3)
  expect(sl.getLineWith(2)).toBeCloseTo(2);
})
