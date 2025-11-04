import CalculatorBase from "../src/CalculatorBase";

it('basic instance creation', () => {
	const sl = new CalculatorBase();
	expect(sl).toBeInstanceOf(CalculatorBase);
});

it('spheer scaling tests', () => {

	const calc = new CalculatorBase();
	for (let distance = 4; distance < 100; ++distance) {

		let lastr = 0;
		for (let count = 2; count < 100; count++) {
			const r = calc.computeRforEvenlySpacedPointsOnCircle(distance, count);
			const degree = 360 / count;
			const pa = calc.getXY(0, 0, r, 0);
			const pb = calc.getXY(0, 0, r, degree);
			const compare = calc.getDistance(pa.x, pa.y, pb.x, pb.y);
			expect(r).toBeGreaterThan(lastr);
			expect(compare).toBeCloseTo(distance);
		}
	}
})