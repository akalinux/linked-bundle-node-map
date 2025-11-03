import { ContainerBox, Cordinate } from "./CommonTypes";
const CORE_R = 12;
const Rad2Deg = 180.0 / Math.PI;
const FULL_CIRCLE = 2 * Math.PI;
const TRIANGLE_MARGINE_FOR_ERROR = 1.00004;
export { CORE_R, FULL_CIRCLE, Rad2Deg, TRIANGLE_MARGINE_FOR_ERROR }

export default class CalculatorBase {
	r: number = CORE_R;

	insideBox(cb: ContainerBox, p: Cordinate) {
		const { ne, nw, se, sw, } = cb;
		const boxArea = (
			this.triangleArea(ne.x, ne.y, nw.x, nw.y, se.x, se.y)
			+
			this.triangleArea(ne.x, ne.y, nw.x, nw.y, sw.x, sw.y)
		) * TRIANGLE_MARGINE_FOR_ERROR
		
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

	insideCircle(p: Cordinate, c: Cordinate, r: number) {
		return (p.x - c.x) ** 2 + (p.y - c.y) ** 2 <= r ** 2;
	}

	triangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
		return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) * .5)
	}


	computeRforEvenlySpacedPointsOnCircle(distance: number,points:number) {
		const r=distance;
		const degree=360/points;
		const a=this.getXY(0,0,r,0);
		const b=this.getXY(0,0,r,degree);
		const cmp=this.getDistance(a.x,a.y,b.x,b.y);
		const scale=r/cmp;
		return r * scale;

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

	insideSquare(n: Cordinate, p: Cordinate, r = this.r) {
		const dx = Math.abs(p.x - n.x);
		const dy = Math.abs(p.y - n.y);
		return (dx > r || dy > r) ? false : true;
	}
	
	rad(degree: number) {
		return degree * Math.PI / 180;
	}
}

