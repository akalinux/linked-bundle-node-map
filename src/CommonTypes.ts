interface ToolTipData{[key:string]:{label:string,data:string[]}}
interface CoreSize {
  width: number;
  height: number;
}

interface NodeEl {
  l: string;
  x: number;
  y: number;
  o: string;
  i: string;
  h?:boolean;
}

interface Cordinate {
  x: number;
  y: number;
  [key: string]: any;
}

interface CanvasSets {
  ctrl: HTMLCanvasElement | null;
  nodes: HTMLCanvasElement | null;
  bundles: HTMLCanvasElement | null;
  animations: HTMLCanvasElement | null;
  links: HTMLCanvasElement | null;
}

interface CoreTransform {
  x: number;
  y: number;
  k: number;
}

interface ContainerBox {
  ne: Cordinate;
  nw: Cordinate;
  se: Cordinate;
  sw: Cordinate;
}

interface NodeElOpt {
  i: undefined | string;
  c: undefined | string;
}

interface LinkElOpt {
  c: string;
}

interface Animation {
  s: Cordinate;
  a: number;
  f: string;
  r: number;
  c: string;
  w: number;
  o: number;
}

interface LinkEl {
  i: string;
  s: string;
  d: string;
  a: string;
  o: string;
  b: undefined | string[];
  n?:{
    s: NodeEl;
    d: NodeEl;
  };
}
interface LinkDraw {
  r?: number;
  l: LinkEl;
  s: Cordinate;
  d: Cordinate;
  i?:string;
};

interface MapChanges {
  nodes: { [nodeId: string]: Cordinate; };
  transform: CoreTransform;
  grid: boolean;
}

interface LinkSet {
  key: string;
  n: {
    s: string;
    d: string;
  };
  l: LinkEl[];
  b: string[];
  s: {
    [bundleName: string]: string[];
  };
  bl?: {
    c: Cordinate;
    b: string;
  }[];
  ll: LinkDraw[];
  lr?: number|undefined;
  br?: number|undefined;
  d?: number|undefined;
  box?: ContainerBox;
  lm: {
    [linkId: string]: LinkDraw;
  };
}

interface BundleDraw {
  b: string;
  l: LinkDraw[];
  s: string;
  d: string;
  p: number;
  r: number;
  i: string;
  c: Cordinate;
  lr: number;
}

interface NavIndex {
  [x: string]: {
    [y: string]: {
      nodes: string[];
      links: string[];
    };
  };
}

interface HasIdEl {
  i: string;
  [key: string]: any;
}
interface NodeLinks {
  [nodeId: string]: {
    order: string[];
    sets: {
      [pairKey: string]: LinkSet;
    };
  };
}
interface PointLookupResult  {
    tp: Cordinate;
    type: string;
    node: null | NodeEl;
    link: null | LinkDraw;
    bundle: null | BundleDraw;
}

type DrawToolTipArgs={ id: string } & Cordinate|null

export {
  ToolTipData,
  DrawToolTipArgs,
  PointLookupResult,
  NodeLinks,
  HasIdEl,
  NavIndex,
  Animation,
  LinkElOpt,
  LinkSet, BundleDraw, LinkDraw, CoreSize, CanvasSets,
  CoreTransform, Cordinate, ContainerBox, MapChanges,
  NodeEl, NodeElOpt, LinkEl
}

