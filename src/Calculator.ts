import { ToolTipData, DrawToolTipArgs, CoreSize, CanvasSets, CoreTransform, ContainerBox, NavIndex, MapChanges, NodeEl, LinkEl, LinkSet, NodeElOpt, LinkElOpt, Animation, HasIdEl, Cordinate, NodeLinks, LinkDraw, PointLookupResult, BundleDraw, } from "./CommonTypes"; import { THEME_MAP, ThemeOptionSets } from "./THEME_MAP";

type NodeLinkChoice = 'links' | 'nodes';
interface LinkSets { [key: string]: LinkSet }
interface SetCalculatorData {
  toolTipData?:ToolTipData,
  changes?: MapChanges;
  grid?: boolean;
  theme?: string;
  transform?: CoreTransform;
  themes?: ThemeOptionSets;
  r?: number;
  autoFit?: boolean,
  noChange?: boolean;
  size?: CoreSize;
  nodes: NodeEl[];
  links: LinkEl[];
  nodeOpts?: { [optId: string]: NodeElOpt };
  linkOpts?: { [option: string]: LinkElOpt };
  noTools?:boolean;
}

const Rad2Deg = 180.0 / Math.PI;
const FULL_CIRCLE = 2 * Math.PI;
const TRIANGLE_MARGINE_FOR_ERROR = 1.00004;
const SD: ['s', 'd'] = ['s', 'd']
const CORE_SIZE = { width: 1920, height: 1080 }
const CORE_R = 12;
const CORE_TRANSFORM = { x: 0, y: 0, k: 1 };

export {SetCalculatorData}

export default class Calculator {
  toolTipData:{[key:string]:{label:string,data:string[]}}={};
  linkCache: { [nodeId: string]: ContainerBox } = {}
  highlight = false;
  textAlign: string = 'center';
  fontFamily: string = 'Arial';
  color: string = 'black';
  bgColor: string = 'white';
  bundleColor: string = 'darkgrey';
  lineColor: string = 'black';
  fillColor: string = 'white';
  theme: string = 'light';
  shadeColor: string = 'lightgrey';
  r: number = CORE_R;
  mouseOverColor: string = 'lightblue';
  stroke:string= 'black';
  fill:string='black';
  contexts: { [key: string]: CanvasRenderingContext2D } = {};
  minMax = {
    minX: NaN,
    minY: NaN,
    maxX: NaN,
    maxY: NaN,
  }
  animations: Animation[] = [];
  fit: boolean = false;
  indexes: NavIndex = {};
  canvases: CanvasSets = {
    ctrl: null, nodes: null, bundles: null, animations: null, links: null
  }
  links: LinkSets = {};
  nodes: { [id: string]: NodeEl } = {};
  nodeLinks: NodeLinks = {};
  rawLinks: { [id: string]: LinkEl } = {};
  nodeOpts: { [optId: string]: NodeElOpt } = {}
  alpha = 1;
  shadeAlpha = .5;
  linkOpts: { [option: string]: LinkElOpt } = {}
  images: { [key: string]: { img: HTMLImageElement, n: NodeEl[], loaded: boolean } } = {};
  imgSize = 24;
  fontSize = 10;
  drag: boolean = false;
  srcNodes: NodeEl[] = [];
  srcLinks: LinkEl[] = [];
  indexSize: number = 48;
  initSize: CoreSize = CORE_SIZE;
  shadeR = 16.97;
  tick = 0;
  ticks = 40;
  tickSlots = 3;
  tickSpace = 4;
  transform: CoreTransform = { ...CORE_TRANSFORM };
  changes: MapChanges = { nodes: {}, transform: this.transform, grid: false };
  noChange: boolean = false;
  lineWidth = 1;
  boxWidth = 21.6;
  boxR = 5.4;
  mounted = false;
  timeout: NodeJS.Timeout | undefined;
  animationTimer = 500;

  setData(dataSet: SetCalculatorData) {
    const { toolTipData, changes, themes, theme, autoFit, noChange, size, nodes, links, nodeOpts, linkOpts, r, transform, grid } = dataSet;
    this.theme = theme || 'light'
    const theme_choices = themes || THEME_MAP;
    Object.assign(this, theme_choices[this.theme]);
    this.srcNodes = nodes || [];
    this.srcLinks = links || [];
    this.r = r || CORE_R;
    this.transform = transform || this.transform || { ...CORE_TRANSFORM };
    this.nodeOpts = nodeOpts || this.nodeOpts || {};
    this.linkOpts = linkOpts || this.linkOpts || {};
    this.initSize = size || CORE_SIZE;
    this.fit = autoFit || false;
    this.noChange = noChange || false;
    this.setR();
    this.changes.nodes = {};
    this.changes.grid = grid || false;
    this.changes.transform = this.transform;
    this.toolTipData=toolTipData||{};
    if (changes) {
      Object.assign(this.changes, changes);
      this.changes.transform = this.transform = changes.transform;
    }
    this.buildData();
  }

  buildIndex(Cs: ContainerBox, target: NodeLinkChoice, obj: HasIdEl) {
    const { ne, nw, se, sw } = Cs;
    if (this.drag) return;
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
    const { indexSize, indexes } = this;
    const startX = sx - sx % indexSize;
    const endX = ex - ex % indexSize;
    const sy = Math.round(minY);
    const ey = Math.round(maxY);
    const startY = sy - sy % indexSize;
    const endY = ey - ey % indexSize;
    for (let x = startX; x <= endX; x += indexSize) {
      const index = indexes[x] || (indexes[x] = {});
      for (let y = startY; y <= endY; y += indexSize) {
        const set = index[y] || (index[y] = { nodes: [], links: [] })
        set[target].push(obj.i);
      }
    }
  }

  getIndex(p: Cordinate, t = this.transform) {
    const { indexSize, indexes } = this;
    const tp = this.translateCanvasYX(p, t);
    const rx = Math.round(tp.x);
    const x = rx - rx % indexSize;
    if (!indexes.hasOwnProperty(x)) return { tp };
    const lx = indexes[x];
    const ry = Math.round(tp.y);
    const y = ry - ry % indexSize;
    return lx.hasOwnProperty(y) ? { ...lx[y], tp } : { tp, nodes: undefined, links: undefined };
  }

  getChanges() {
    return this.changes;
  }

  onMount() {
    if (this.mounted) return;
    this.mounted = true;
  }

  onUnMount() {
    if (!this.mounted) return;
    this.mounted = false
    clearTimeout(this.timeout);
  }

  setTransform(t: CoreTransform) {
    if (this.noChange) return;
    Object.assign(this.transform, t);
    this.draw();
  }

  forceDraw(size = this.initSize) {
    this.drag = false;
    this.draw(size);
  }

  draw(size = this.initSize) {
    this.initSize = size;
    if (this.mounted) {
      this.drawNodes();
    }
  }

  scaleSize(scale: number, size = this.initSize) {
    if (this.noChange) return;
    this.fit = false;
    if (scale < .01) return;
    this.transform.k = scale;
    this.draw(size)
  }

  redoMinMax() {
    const { minMax, nodes } = this;
    let i = 0;
    for (let id in nodes) {
      const node = nodes[id];
      const minX = node.x
      const minY = node.y
      const maxX = node.x
      const maxY = node.y
      if (i++ == 0) {
        Object.assign(minMax, { minX, minY, maxX, maxY });
        continue;
      }
      if (maxX > minMax.maxX) minMax.maxX = maxX
      if (maxY > minMax.maxY) minMax.maxY = maxY
      if (minX < minMax.minX) minMax.minX = minX;
      if (minY < minMax.minY) minMax.minY = minY;
    }
  }

  createCenertTransform(minMax = this.minMax, offset = this.imgSize * 2.7) {
    const { width, height } = this.initSize;
    const h = Math.abs(minMax.maxY - minMax.minY + offset);
    const w = Math.abs(minMax.maxX - minMax.minX + offset);
    const scaleX = width / w
    const scaleY = height / h;
    const scale = scaleX < scaleY ? scaleX : scaleY;
    const ox = width * .5 - w * .5 * scale;
    const oy = height * .5 - h * .5 * scale;
    return {
      k: scale,
      x: ox - (minMax.minX - offset * .5) * scale,
      y: oy - (minMax.minY - offset * .5) * scale,
    }
  }

  fitSize() {
    if (this.noChange) return;
    Object.assign(this.transform, this.createCenertTransform());
  }

  clearCtrl(clear = true) {
    if (!clear) return;

    if (this.highlight) {
      const { ctrl } = this.contexts;
      const { x, y, k } = this.transform
      ctrl.setTransform(1, 0, 0, 1, 0, 0);
      ctrl.clearRect(0, 0, this.initSize.width, this.initSize.height);
      ctrl.setTransform(k, 0, 0, k, x, y);
    }
    this.highlight = false;
  }

  drawHighlight(res: PointLookupResult, p: Cordinate) {
    this.clearCtrl(true);
    this.highlight = true;

    const { ctrl } = this.contexts;
    ctrl.globalAlpha = this.shadeAlpha;
    if (res.node) {
      this.drawNodeHighlght(ctrl, res.node);
      this.drawToolTip({ id: res.node.i, ...p })
    } else if (res.link) {
      this.drawLinkHighlight(ctrl, res.link);
      this.drawToolTip({ id: res.link.l.i, ...p });
    } else if (res.bundle) {
      const { bundle } = res;
      this.drawBundleHighlight(ctrl, bundle);
      this.drawToolTip({ id: bundle.i, ...p });
    } else {
      this.highlight = false;
    }
    ctrl.globalAlpha = this.alpha;
  }

  drawCenteredOnNode(node: NodeEl) {
    if (!node) return;
    const n = this.nodes[node.i];
    const { width, height } = this.initSize;

    const { k } = this.transform;
    const x = width * .5 - n.x * k
    const y = height * .5 - n.y * k
    Object.assign(this.transform, { x, y });
    this.draw();
  }

  drawToolTip = (args: DrawToolTipArgs) => { }

  drawNodeHighlght(ctrl: CanvasRenderingContext2D, node: NodeEl) {
    this.drawCircle(
      ctrl,
      node,
      this.shadeColor,
      this.shadeR,
      this.shadeColor
    )
  }

  drawLinkHighlight(ctrl: CanvasRenderingContext2D, link: LinkDraw) {
    const lr = link.r || this.r;
    this.drawLine(ctrl,
      link.s,
      link.d,
      this.shadeColor,
      lr * 3
    )
    const { r, imgSize } = this;
    const { s, d } = link.l;
    if (!this.nodes[s].h) {
      const n = this.nodes[s]
      ctrl.clearRect(n.x - r, n.y - r, imgSize, imgSize)
      this.drawNodeHighlght(ctrl, n)
    }

    if (!this.nodes[d].h) {
      const n = this.nodes[d]
      ctrl.clearRect(n.x - r, n.y - r, imgSize, imgSize)
      this.drawNodeHighlght(ctrl, n)
    }
  }

  drawBundleHighlight(ctrl: CanvasRenderingContext2D, bundle: BundleDraw) {
    const { s, d, l, lr, c, r } = bundle
    for (let i = 0; i < l!.length; ++i) {
      const link = l![i];
      this.drawLine(ctrl,
        link.s,
        link.d,
        this.shadeColor,
        lr * 3
      )
    }
    const { imgSize } = this;
    if (!this.nodes[s].h) {
      const n = this.nodes[s]
      ctrl.clearRect(n.x - r, n.y - r, imgSize, imgSize)
      this.drawNodeHighlght(ctrl, n)
    }
    if (!this.nodes[d].h) {
      const n = this.nodes[d]
      ctrl.clearRect(n.x - r, n.y - r, imgSize, imgSize)
      this.drawNodeHighlght(ctrl, n)
    }
    this.drawCircle(
      ctrl,
      c,
      this.shadeColor,
      r + lr,
      this.shadeColor
    )
  }

  drawNodes() {
    this.indexes = {};
    this.linkCache = {};
    this.animations = [];
    const { width, height } = this.initSize;
    const { srcNodes } = this;
    if (this.fit && srcNodes.length != 0) {
      const noChange = this.noChange;
      this.noChange = false;
      this.fitSize();
      this.noChange = noChange;
    }
    // always force the fit state to false
    this.fit = false;
    const contexts: { [key: string]: CanvasRenderingContext2D } = {};

    const { x, y, k } = this.transform
    const { r, nodes } = this;
    for (const [name, canvas] of Object.entries(this.canvases)) {
      const context = contexts[name] = canvas.getContext("2d");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, width, height);
      context.textAlign = this.textAlign;
      context.font = this.fontSize + 'px ' + this.fontFamily;
      canvas.width = width;
      canvas.height = height;
      context.setTransform(k, 0, 0, k, x, y);
    }
    const drawnLinks: { [key: string]: number } = {};
    for (let i = srcNodes.length - 1; i > -1; --i) {
      const node = nodes[srcNodes[i].i];

      if (!node.h) {
        this.drawNode(node);
        const box = this.createNodeBox(node, r);
        this.buildIndex(box, 'nodes', node);
      }
      const links = this.nodeLinks[node.i];
      if (!links) continue;
      const { order, sets } = links;
      for (let idx = order.length - 1; idx > -1; --idx) {
        const key = order[idx];
        if (drawnLinks[key]) continue;
        drawnLinks[key] = 1;
        this.drawLink(sets[key]);
      }
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.onAnimate, this.animationTimer);
  }

  onAnimate = () => {
    clearTimeout(this.timeout);
    const todo = this.animations;
    if (todo.length == 0) return;
    ++this.tick;

    const { width, height } = this.initSize;
    const { animations } = this.contexts;
    animations.setTransform(1, 0, 0, 1, 0, 0);
    animations.clearRect(0, 0, width, height);
    const { x, y, k } = this.transform;
    animations.setTransform(k, 0, 0, k, x, y);
    const tick = this.tick;
    for (let i = 0; i < todo.length; ++i) {
      this.tick += i;
      this.drawAinimation(animations, todo[i]);
    }
    this.tick = tick;
    this.timeout = setTimeout(this.onAnimate, this.animationTimer);
  }

  drawNode(node: NodeEl) {
    const opts = this.nodeOpts[node.o];
    const { nodes } = this.contexts;
    this.drawText(nodes, node, node.l);
    if (opts.i) {
      this.drawImage(nodes, node, opts.i)
    } else {
      this.drawBox(nodes, node, opts.c || '');
    }
  }

  drawLink(ls: LinkSet) {
    const { l, n, b } = ls;
    if (l.length == 0) return;
    const w = this.getLineWith(ls);
    const p = this.nodes[n.s]
    const c = this.nodes[n.d]
    const ba = this.GetAngle(p.x, p.y, c.x, c.y);
    const da = this.GetAngle(c.x, c.y, p.x, p.y);
    const angle = ba + 270;
    const { linkOpts, boxWidth, boxR } = this;
    const ne = this.getXY(c.x, c.y, boxR, angle);
    const nw = this.getXY(p.x, p.y, boxR, angle);
    const sa = angle + 180;
    const { links, animations, bundles } = this.contexts
    const incBy = w + boxWidth / (2 * l.length + 1);
    const o = w + w * .5;
    const ll = ls.ll = [] as LinkDraw[];
    const d = this.getDistance(p.x, p.y, c.x, c.y);
    ls.lr = w * .5;
    for (let i = 0; i < l.length; ++i) {
      const link = l[i];
      const r = o + i * incBy;
      const start = this.getXY(ne.x, ne.y, r, sa);
      const end = this.getXY(nw.x, nw.y, r, sa);
      const c = linkOpts[link.o].c

      this.drawLine(links, start, end, c, w);
      const lmv: LinkDraw = { i: link.i, s: start, d: end, l: link };
      ll.push(ls.lm[link.i] = lmv);
      const as = { s: { a: ba, s: start }, d: { a: da, s: end } };
      if (link.a) {
        const { a } = link;
        if (a == 's' || a == 'd') {
          /** @type {Animation} */
          const animate: Animation = {
            ...as[a],
            r: d,
            c,
            f: c,
            w: w * .75,
            o: i,
          }
          this.animations.push(animate);
          this.drawAinimation(animations, animate);

        } else if (a == 'b') {
          for (let i = 0; i < SD.length; ++i) {
            const a = SD[i];
            /** @type {Animation} */
            const animate: Animation = {
              ...as[a],
              r: d,
              c,
              o: i,
              f: i ? c : this.bgColor,
              w: w * .75,
            }
            this.animations.push(animate);
            this.drawAinimation(animations, animate);
          }
        }
      }
    }
    const se = this.getXY(c.x, c.y, boxR, sa);
    const sw = this.getXY(p.x, p.y, boxR, sa);
    const bl = ls.bl = [] as { c: Cordinate, b: string }[];
    const box = ls.box = { ne, nw, se, sw }
    this.buildIndex(box, 'links', { i: ls.key });
    const bR = boxR - w * .5;
    ls.br = bR;
    for (let i = 0; i < b.length; ++i) {
      const pos = this.computeLinePoint(p, d, ba + 180, b.length, i);
      bl.push({ c: pos, b: b[i] });
      this.drawCircle(bundles, pos, this.bundleColor, bR)
      this.drawCircle(bundles, pos, this.bundleColor, bR / 1.5)
      this.drawCircle(bundles, pos, this.bundleColor, bR / 4,)
    }
  }

  drawAinimation(context: CanvasRenderingContext2D, animation: Animation) {
    const { a, c, f, r, s, w, o } = animation
    const { tick, tickSlots, ticks, tickSpace } = this;
    for (let i = 0; i < tickSlots; ++i) {
      const tc = (o + tick + (i + 1) * tickSpace) % ticks;
      const pos = this.computeLinePoint(s, r, a, ticks, tc);
      this.drawCircle(context, pos, c, w, f)
    }
  }

  setR(r = this.r) {
    this.r = r;
    this.imgSize = r * 2;
    this.indexSize = r * 4;
    this.boxWidth = this.r * 1.3;
    this.boxR = this.boxWidth * .5;
    this.shadeR = .5 * this.getDistance(0, 0, this.imgSize, this.imgSize);
    this.fontSize = Math.round(r * 5 / 6);
  }

  createNodeBox(c: Cordinate, r: number) {
    const o: ContainerBox = { ne: { x: 0, y: 0 }, nw: { x: 0, y: 0 }, se: { x: 0, y: 0 }, sw: { x: 0, y: 0 }, };
    o.ne.x = o.se.x = c.x + r;
    o.nw.x = o.sw.x = c.x - r;
    o.se.y = o.sw.y = c.y + r;
    o.nw.y = o.ne.y = c.y - r;
    return o;
  }

  createLinkBox(s: Cordinate, d: Cordinate, r = this.lineWidth) {
    const angle = this.GetAngle(
      s.x,
      s.y,
      d.x,
      d.y
    );
    const angle_right = (angle + 90);
    const angle_left = (angle_right + 180);
    const ne = this.getXY(s.x, s.y, r, angle_right);
    const nw = this.getXY(s.x, s.y, r, angle_left);
    const se = this.getXY(d.x, d.y, r, angle_right);
    const sw = this.getXY(d.x, d.y, r, angle_left);
    const cb: ContainerBox = { ne, nw, se, sw };
    return cb;
  }

  insideSquare(n: Cordinate, p: Cordinate, r = this.r) {
    const dx = Math.abs(p.x - n.x);
    const dy = Math.abs(p.y - n.y);
    return (dx > r || dy > r) ? false : true;
  }

  lookupPoint(p: Cordinate,) {
    const el = this.getIndex(p);

    const res: PointLookupResult = {
      type: 'none',
      bundle: null,
      node: null,
      link: null,
      tp: el.tp,
    }
    if (Object.keys(el).length == 1) return res;
    const { tp, nodes, links } = el;
    for (let i = 0; nodes && i < nodes.length; ++i) {
      const node = this.nodes[nodes[i]];
      if (this.insideSquare(node, tp)) {
        res.node = node || null;
        res.type = 'node';
        return res;
      }
    }
    for (let i = 0; links && i < links.length; ++i) {
      const key = links[i];
      const nl = this.links[key] as LinkSet;
      if (this.insideBox(nl.box!, tp)) {
        for (let i = 0; i < nl.bl!.length; ++i) {
          const { b, c } = nl.bl![i];
          if (this.insideCircle(tp, c, nl.br!)) {
            res.type = 'bundle';
            const bundle = res.bundle = {
              b,
              ...nl.n,
              p: i,
              r: nl.br!,
              i: nl.key + ',' + b,
              c,
              lr: nl.lr!,
              l: [] as LinkDraw[],
            }
            const links = bundle.l;
            const s = nl.s[b];
            const { lm } = nl;
            for (let i = 0; i < s.length; ++i) {
              links.push(lm[s[i]]);
            }
            return res;
          }

        }
        const { ll, l, lr } = nl;
        for (let i = 0; i < ll.length; ++i) {
          const src = ll[i];
          const box = this.linkCache[src.i!] || (this.linkCache[src.i!] = this.createLinkBox(src.s, src.d, lr));
          if (this.insideBox(box, tp)) {
            res.link = { l: l[i], s: src.s, d: src.d, r: lr };
            res.type = 'link';
            return res;
          }
        }
      }
    }
    return res;
  }

  insideCircle(p: Cordinate, c: Cordinate, r: number) {
    return (p.x - c.x) ** 2 + (p.y - c.y) ** 2 <= r ** 2;
  }

  triangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) * .5)
  }

  insideBox(cb: ContainerBox, p: Cordinate) {
    const { ne, nw, se, sw, } = cb;
    // calculate the area of the boxy first
    const width = this.getDistance(ne.x, ne.y, nw.x, nw.y);
    const height = this.getDistance(ne.x, ne.y, se.x, se.y);
    const boxArea = width * height * TRIANGLE_MARGINE_FOR_ERROR;

    let triangleSum = 0;
    const order = [ne, nw, sw, se, ne];
    for (let id = 0; id < 4; ++id) {
      const left = order[id];
      const right = order[id + 1];
      const area = this.triangleArea(p.x, p.y, left.x, left.y, right.x, right.y);
      triangleSum += area;
      if (triangleSum > boxArea) return false;
    }
    return true;
  }

  computeLinePoint(s: Cordinate, r: number, a: number, slots: number, pos: number) {
    const scale = 1 / (slots + 1);
    const next = r * (pos + 1) * scale;
    return this.getXY(s.x, s.y, next, a)
  }

  drawLine(context: CanvasRenderingContext2D, s: Cordinate, d: Cordinate, c: string, w: number) {
    context.beginPath();
    context.lineWidth = w;

    context.strokeStyle = c;
    context.moveTo(s.x, s.y);
    context.lineTo(d.x, d.y);
    context.closePath();
    context.stroke();
  }

  drawImage(context: CanvasRenderingContext2D, node: NodeEl, src: string) {
    if (this.images[src]) {
      if (this.images[src].loaded) {
        context.drawImage(this.images[src].img, node.x - this.r, node.y - this.r, this.imgSize, this.imgSize);
      } else {
        this.images[src].n.push(node);
      }
    } else {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.images[src].loaded = true;
        if (!this.mounted) return;

        const nodes = this.images[src].n;
        for (let i = 0; i < nodes.length; ++i) {
          const node = nodes[i];
          context.drawImage(this.images[src].img, node.x - this.r, node.y - this.r, this.imgSize, this.imgSize);
        }
      }
      this.images[src] = {
        loaded: false,
        img,
        n: [node],
      }
    }
  }

  drawCircle(context: CanvasRenderingContext2D, n: Cordinate, c: string, r = this.r, f?: string) {
    context.beginPath();
    if (f) context.fillStyle = f;
    context.strokeStyle = c;
    context.lineWidth = this.lineWidth;
    context.arc(n.x, n.y, r, 0, FULL_CIRCLE);
    if (f) context.fill();
    context.stroke();
    context.closePath();
  }

  drawBox(context: CanvasRenderingContext2D, n: Cordinate, c: string, r = this.r, imgSize = this.imgSize) {
    context.fillStyle = c;
    context.rect(n.x - r, n.y - r, imgSize, imgSize)
    context.fill();
  }

  drawText(context: CanvasRenderingContext2D, n: Cordinate, l: string) {
    context.fillStyle = this.color;
    const meta = context.measureText(l);
    const xo = meta.width / -2;
    const yo = (meta.actualBoundingBoxAscent + meta.actualBoundingBoxDescent) / 2 + this.r;
    context.fillText(l, n.x + xo, n.y - yo);
  }

  GetAngle(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2,
      dy = y1 - y2;

    const base = Math.atan2(dy, dx) * Rad2Deg;//- 180;
    if (base < 0) return base + 360.0;
    return base;
  }

  getXY(cx: number, cy: number, r: number, degree: number) {
    const rad = this.rad(degree);

    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    const cd: Cordinate = { x, y };
    return cd;
  }

  getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(this.getDistanceSquare(x1, y1, x2, y2))
  }

  getDistanceSquare(x1: number, y1: number, x2: number, y2: number) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2
  }

  getLineWith(l: { l: any[], [key: string]: any }) {
    return this.boxWidth / (l.l.length * 2 + 1);
  }

  rad(degree: number) {
    return degree * Math.PI / 180;
  }

  buildData() {
    this.indexes = {};
    /** @type {LinkSets} */
    const links: LinkSets = {};
    const nodes: { [id: string]: NodeEl } = {};
    const nodeLinks: NodeLinks = {};
    const { linkOpts, nodeOpts, minMax, srcNodes, srcLinks } = this;
    for (const img of Object.values(this.images)) {
      img.n = [];
    }
    for (let i = 0; i < srcNodes.length; ++i) {
      const node = srcNodes[i];
      if (typeof node.i == "undefined") throw new Error(`Bad node, no i in srcNodes[${i}]`)
      if (typeof node.x != 'number' || typeof node.y != "number") throw (new Error(`invalid x or y value in srcNodes[${i}]`));
      if (!node.l) throw new Error(`Bad node, no l in srcNodes[${i}]`)
      if (!node.o || !nodeOpts[node.o]) throw new Error(`Bad node options, check value of: o,  in srcNodes[${i}]`)
      if (!nodeOpts[node.o].i && !nodeOpts[node.o].c) throw new Error(`No image or color option set for node: srcNodes[${i}] in nodeOpts for ${node.o}`);
      if (nodes[node.i]) throw new Error(`Duplicate node: [${node.i}] in srcNodes[${i}]`);
      nodes[node.i] = node;
      if (i == 0) {
        minMax.minX = node.x
        minMax.minY = node.y

        minMax.maxX = node.x
        minMax.maxY = node.y
      } else {

        if (node.x > minMax.maxX) minMax.maxX = node.x
        if (node.y > minMax.maxY) minMax.maxY = node.y
        if (node.x < minMax.minX) minMax.minX = node.x;
        if (node.y < minMax.minY) minMax.minY = node.y;
      }
    }
    const sane: { [id: string]: LinkEl } = this.rawLinks = {};
    for (let i = 0; i < srcLinks.length; ++i) {
      const link = srcLinks[i];
      if (typeof link.i == 'undefined') throw new Error(`bad link in srcLinks[${i}], no i`);
      if (sane[link.i]) throw new Error(`Duplicate link.i ${link.i} in srcLinks[${i}`);
      sane[link.i] = link;
      if (!link.o || !linkOpts[link.o] || !linkOpts[link.o].c) throw new Error(`missing inkin opions in: srcLinks[${i}]`)
      if (typeof link.s == 'undefined' || !nodes[link.s] || typeof link.d == 'undefined' || !nodes[link.d] || link.s == link.d)
        throw new Error(`Bad link in srcNodes[${i}], missing node(s)`)
      const key = link.s > link.d ? (link.d + ',' + link.s) : (link.s + ',' + link.d);
      const set = links[key] || (links[key] = { bl: [], ll: [], lm: {}, l: [], b: [], s: {}, key, n: { s: link.s, d: link.d } });
      const { sets, order } = (nodeLinks[link.s] || (nodeLinks[link.s] = { sets: {}, order: [] }));
      if (!sets[key]) {
        sets[key] = set;
        order.push(key);
      }
      const { l, b, s } = set;
      l.push(link);
      if (!link.b) continue;
      if (!Array.isArray(link.b)) throw new Error(`Bad Bundle in srcLinks[${i}], b must be an array of strings`);
      for (const tb of link.b) {
        if (!s[tb]) {
          b.push(tb);
        }
        s[tb] || (s[tb] = [])
        s[tb].push(link.i);
      }
    }
    this.links = links;
    this.nodes = nodes;
    this.nodeLinks = nodeLinks;
  }

  moveNode(id: string, p: Cordinate) {
    if (this.noChange) return;
    this.fit = false;
    const node = this.nodes[id];
    this.changes.nodes[id] = p;
    this.nodes[id] = { ...node, x: p.x, y: p.y };

    this.draw();
  }

  moveCanvas(p: Cordinate) {
    if (this.noChange) return;
    const { x, y } = p;
    this.transform.x = x
    this.transform.y = y;
    this.fit = false;
    this.draw();
  }

  translateCanvasYX(p: Cordinate, t = this.transform) {
    const x = (p.x - t.x) / t.k;
    const y = (p.y - t.y) / t.k;
    return { x, y } as Cordinate
  }
}
