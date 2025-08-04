import {Cordinate,PointLookupResult,DrawToolTipArgs} from './CommonTypes';
import { MouseEvent } from 'react';
import Calculator from './Calculator';
import {StatusContextInterface,OnChange,OnClick} from './FormContext';

export default class MouseWatcher {

  /** @param {Calulator} calc  
   * @param {FormContextSet} SC
  */
  constructor(calc:Calculator, SC:StatusContextInterface) {
    this.calc = calc;
    this.SC = SC;
  }
  /** @type {FormContextSet} */
  SC:StatusContextInterface;
  mounted = false;
  timer = 800;

  /** @type {Calulator} */
  calc:Calculator;
  /** @type {HTMLDivElement} */
  div:HTMLDivElement|undefined;

  down:{[key:string]:number}|null = null;
  lastMo:{[key:string]:number}|null = null;
  drag:{[key:string]:number}|null = null;
  timeout:any = null;
  tp:Cordinate|undefined|null;

  dragTarget:PointLookupResult|null|undefined=null;

  /** @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e  */
  pd(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation()
  }
  buildXY(event:{clientX:number,clientY:number}) {
    const { calc, div } = this;
    const { top, left, width, height } = div!.getBoundingClientRect();
    const xS = calc.initSize.width / width;
    const yS = calc.initSize.height / height;
    const x = event.clientX - left
    const y = event.clientY - top;
    const cor = {
      rx: x,
      ry: y,
      x: x * xS,
      y: y * yS,
      yS,
      xS,
      top,
      left,
      ex: event.clientX,
      ey: event.clientY,
    }
    return cor;
  }
  /** @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e  */
  onMouseLeave = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.pd(e);
    if (this.down) {
      if (this.drag) {
        this.onDragEnd();
      }
      this.drag = null;
      this.down = null;
      this.dragTarget = null;
    }
    clearTimeout(this.timeout)
  }
  onMouseEnter = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.pd(e);
  }
  
  onWheel = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.pd(e)
    if (this.down) return;
    if (this.calc.noChange) return;
    // @ts-ignore
    const { deltaY } = e;
    const { calc } = this;
    if (deltaY > 0) {
      calc.scaleSize(calc.transform.k - .05);
    } else {
      calc.scaleSize(calc.transform.k + .05);
    }

    const data = this.calc.getChanges();
    const event = new OnChange({ data, tag: 'onWheel' });
    this.SC.setFormValue(data)
    this.SC.sendEvent(event);
  }

  /** @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e  */
  onMousMove = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.pd(e)
    clearTimeout(this.timeout);
    this.calc.clearCtrl();
    if (this.down) {
      this.drawToolTip(null);
      if (this.drag) {
        this.onDrag(e);
      } else {
        this.drag = this.buildXY(e);
        this.onDragStart();
      }
    } else {
      this.drag = null;
      this.drawToolTip(null);
      this.timeout = setTimeout(() => this.onMouseOver(e), this.timer);
    }
  }
  
  onMouseOver = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const p = this.lastMo = this.buildXY(e);
    const res = this.calc.lookupPoint(p);
    this.calc.drawHighlight(res, { x: p.rx, y: p.ry });
  }

  onShowToolTip = (params:{ id:string,[key:string]:any }) => {
    if (!this.lastMo) return;
    const { ex, ey } = this.lastMo;
    const {id}=params;
    this.drawToolTip({ id, x: ex, y: ey });
  }
  
  drawToolTip = (args: DrawToolTipArgs) => {

  }
  /** @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e  */
  onMouseDown = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.pd(e)
    this.down = this.buildXY(e);
  }

  /** @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e  */
  onMouseUp = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.pd(e);
    if (this.down) {
      this.down = null;
      if (this.drag) {
        this.drag = null;
        this.onDragEnd();
      } else {
        const pos = this.buildXY(e);
        const res = this.calc.lookupPoint(pos);
        if (res.type != 'none') {
          if (this.calc.noChange) return;
          // @ts-ignore
          const data = res[res.type];
          const { type } = res;
          let tag=type;
          if (type == 'link') {
            tag +='-'+ data.l.i;
          } else if (type == 'node') {
            tag +='-'+ data.i;
          } else if (type == 'bundle') {
            // bundle
            tag +='-'+ data.i;
          }
          const event = new OnClick({ data, tag });
          this.SC.setFormValue(this.calc.getChanges())
          this.SC.sendEvent(event);
        }
      }
    }
  }
  
  onDragStart() {
    // @ts-ignore
    const res = this.calc.lookupPoint(this.drag);

    this.calc.drag = true;
    this.tp = res.tp;
    if (res.type != 'none') {
      // @ts-ignore
      this.dragTarget = res;
    }
  }
  
  onDrag(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const pos = this.buildXY(e);
    const { calc } = this;
    const p = calc.translateCanvasYX(pos);

    if (this.dragTarget && this.dragTarget.type == 'node') {
      calc.moveNode(this.dragTarget.node!.i, p);
    } else {
      const { tp } = this;
      const dx = p.x - tp!.x;
      const dy = p.y - tp!.y
      const { x, y, } = calc.transform;
      const np = {
        x: (x + dx),
        y: (y + dy),
      }
      calc.moveCanvas(np);
    }
  }

  onDragEnd() {
    //this.pd(e)
    this.dragTarget = null;
    this.tp = null;
    this.calc.forceDraw();
    if (this.calc.noChange) return;
    const data = this.calc.getChanges();
    const event = new OnChange({ data, tag: 'onDrag' });
    this.SC.setFormValue(data)
    this.SC.sendEvent(event);
  }

  onNode = (node:HTMLDivElement) => {
    clearTimeout(this.timeout)
    if (node == null) {
      this.mounted = false;
      this.cleanup();
    } else {
      this.mounted = true;
      this.cleanup();
      this.setup(node);
    }
  }

  cleanup() {
    const { div } = this;
    if (!div) return;
    this.drivers.forEach(({ event, method }) => {
      // @ts-ignore
      div.removeEventListener(event, method)
    })
  }
  
  setup(div:HTMLDivElement) {
    this.div = div;
    this.drivers.forEach(({ event, method, opt }) => {
      // @ts-ignore
      div.addEventListener(event, method, opt);
    })
  }
  drivers = [
    { event: 'wheel', method: this.onWheel, opt: { passive: false } },
    { event: 'mouseenter', method: this.onMouseEnter, opt: { passive: false } },
    { event: 'mouseleave', method: this.onMouseLeave, opt: { passive: false } },
    { event: 'mousemove', method: this.onMousMove, opt: { passive: false } },
    { event: 'mouseup', method: this.onMouseUp, opt: { passive: false } },
    { event: 'mousedown', method: this.onMouseDown, opt: { passive: false } },
  ];

  static startup(calc:Calculator, SC:StatusContextInterface, setTT:(args: DrawToolTipArgs)=>void) {
    const o = new MouseWatcher(calc, SC);
    calc.drawToolTip=o.drawToolTip = setTT;
    return o;
  }
}