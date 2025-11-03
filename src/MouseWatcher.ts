import { Cordinate, PointLookupResult, DrawToolTipArgs } from './CommonTypes';
import { MouseEvent } from 'react';
import Calculator from './Calculator';
import { StatusContextInterface, OnChange, OnClick, NodeChange } from './FormContext';

export default class MouseWatcher {


	constructor(calc: Calculator, SC: StatusContextInterface) {
		this.calc = calc;
		this.SC = SC;
	}
	SC: StatusContextInterface;
	mounted = false;
	timer = 400;

	calc: Calculator;
	div: HTMLDivElement | undefined;

	down: { [key: string]: number } | null = null;
	lastMo: { [key: string]: number } | null = null;
	drag: { [key: string]: number } | null = null;
	timeout: any = null;
	tp: Cordinate | undefined | null;

	dragTarget: PointLookupResult | null | undefined = null;

	pd(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		e.preventDefault();
		e.stopPropagation()
	}
	buildXY(event: { clientX: number, clientY: number }) {
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

	onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
	onMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		this.pd(e);
	}

	onWheel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		this.pd(e)
		if (this.down) return;
		if (this.calc.noChange) return;
		const { deltaY } = e as unknown as WheelEvent;
		const { calc } = this;
		if (deltaY > 0) {
			calc.scaleSize(calc.transform.k - .05);
		} else {
			calc.scaleSize(calc.transform.k + .05);
		}

		const data = this.calc.getChanges();
		const event = new OnChange({ data, tag: 'onWheel' });
		this.SC.sendEvent(event, data);
	}

	onMousMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

	onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const p = this.lastMo = this.buildXY(e);
		const res = this.calc.lookupPoint(p);
		this.calc.drawHighlight(res, { x: p.rx, y: p.ry });
	}

	onShowToolTip = (params: { id: string, [key: string]: any }) => {
		if (!this.lastMo) return;
		const { ex, ey } = this.lastMo;
		const { id } = params;
		this.drawToolTip({ id, x: ex, y: ey });
	}

	drawToolTip = (args: DrawToolTipArgs) => {

	}

	onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		this.pd(e)
		this.down = this.buildXY(e);
	}

	onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
					const { type } = res;
					let tag = type;
					if (type == 'link' && res.link !== null) {
						tag += '-' + res.link.l.i;
					} else if (type == 'node' && res.node !== null) {
						tag += '-' + res.node.i;
					} else if (type == 'bundle' && res.bundle !== null) {
						tag += '-' + res.bundle.i;
					} else {
						return;
					}
					const event = new OnClick({ data: res, tag });
					this.SC.sendEvent(event, this.calc.getChanges());
				}
			}
		}
	}

	onDragStart() {
		if (this.drag === null) return;
		const res = this.calc.lookupPoint(this.drag as Cordinate);

		this.calc.drag = true;
		this.tp = res.tp;
		if (res.type != 'none') {
			this.dragTarget = res;
		}
	}

	onDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
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
      console.log({p,np,x,y});
      
			calc.moveCanvas(np);
		}
	}

	onDragEnd() {
		const dt = this.dragTarget;
		this.dragTarget = null;
		this.tp = null;
		this.calc.forceDraw();
		if (this.calc.noChange) return;
		const data = this.calc.getChanges();
		let event;
		if (dt !== null && typeof dt != 'undefined' && dt.node!==null) {
			event = new NodeChange({ data: dt, tag: `node-${dt.node.i}`});
			event.name='NodeDrag';
		} else {
			event = new OnChange({ data, tag: 'onMapDrag' });
		}
		this.SC.sendEvent(event, data);
	}

	onNode = (node: HTMLDivElement) => {
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
			div.removeEventListener(event as keyof EventListener, method)
		})
	}

	setup(div: HTMLDivElement) {
		this.div = div;
		this.drivers.forEach(({ event, method, opt }) => {
			div.addEventListener(event as keyof EventListener, method, opt);
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

	static startup(calc: Calculator, SC: StatusContextInterface, setTT: (args: DrawToolTipArgs) => void) {
		const o = new MouseWatcher(calc, SC);
		calc.drawToolTip = o.drawToolTip = setTT;
		return o;
	}
}