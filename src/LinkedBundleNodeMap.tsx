import React, { useContext, forwardRef, useRef, useEffect, useSyncExternalStore, Fragment, useMemo } from 'react';
import Calculator, { SetCalculatorData } from './Calculator';
import ManageInstance from './ManageInstance';
import CalculatorContext from './CalculatorContext';
import FormContext, { Reset, OnChange, LinkedMapStatus } from './FormContext';
import { CanvasSets } from './CommonTypes';
import ThemeContext from './ThemeContext';
import MouseWatcher from './MouseWatcher';
import CreateTT from './CreateTT';
import Grid from './Grid';
import ToolTipContext from './ToolTipContext';
import ToolsContext from './ToolsContext';
import MergeMapChanges from './MergeMapChanges';
import CreateCalculatorContext from './CreateCalculatorContext';

const COMPASS_MAP: { [key: string]: { x: number, y: number } } = {
	n: { x: 0, y: -1 },
	s: { x: 0, y: 1 },
	e: { x: 1, y: 0 },
	w: { x: -1, y: 0 },
}
const COMPASS_TAGS: { [key: string]: string } = {
	n: 'compass-north',
	e: 'compass-east',
	s: 'compass-south',
	w: 'compass-west',
	c: 'compass-center',
}


type KnownNames = 'ctrl' | 'nodes' | 'bundles' | 'links' | 'animations';
const NAMES: KnownNames[] = [
	'links',
	'animations',
	'bundles',
	'nodes',
	'ctrl',
];

interface CanvasWatchNames { ref: HTMLCanvasElement | null, name: KnownNames }
interface RefWatch {
	name: KnownNames,
	m: ManageInstance<CanvasWatchNames>,
}

function WatchCanvas(props: RefWatch) {
	const { m, name } = props;
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const send = { ref: (ref && ref.current ? ref.current : null), name }
		m.publish(send);
	}, [ref])
	const send = { ref: (ref && ref.current ? ref.current : null), name }
	m.publish(send);
	return <canvas className='linked-node-map-canvas' ref={ref} />
}

const Draw = (args: { m: ManageInstance<Calculator | null>, props: SetCalculatorData }) => {
	const { m, props } = args;
	const calc = useSyncExternalStore(...m.subscribe())
	useEffect(() => {
		if (!calc) return;
		return () => calc.onUnMount();
	})
	if (!calc) return '';
	try {
		calc.setData(props);
		calc.onMount();
		calc.draw();
	} catch (e) {
		console.error("Failed to render, error was:", e);
	}
	return '';
}

const ShowGrid = (args: { props: SetCalculatorData, wg: ManageInstance<boolean | undefined> }) => {
	const { wg, props } = args;
	const show = useSyncExternalStore(...wg.subscribe());
	const size = props.size || {}
	return show ? <Grid {...size} /> : '';
}

const LinkedBundleNodeMap = forwardRef<HTMLDivElement, SetCalculatorData>((props, ref) => {
	const theme = useContext(ThemeContext);
	const { Compass, Tools, GridToggle, ZoomAndRestore, Search, ToggleFullScreen } = useContext(ToolsContext);
	const conditionalRef = useRef<HTMLDivElement>(null);
	const scRef = ref || conditionalRef;
	const slotRef =  useRef<HTMLDivElement>(null);
	const calc = useContext(CreateCalculatorContext)();
	const fw = useContext(FormContext)
	const [setTT, tooltips] = useMemo(
		() => {
			return CreateTT({
				absolute: true,
				needsOffset: true,
				offsetLeft: 10,
				offsetTop: -5,
			})
		}, []
	);
	const online: CanvasSets = { ctrl: null, bundles: null, links: null, animations: null, nodes: null };
	const slotM = new ManageInstance(slotRef as React.RefObject<HTMLDivElement>);
	fw.setSlotRefWatcher(slotM);
	const m = new ManageInstance<Calculator | null>(null);
	const onRef = (args: CanvasWatchNames) => {
		const { name, ref } = args;
		let changed = false;
		if (ref) {
			if (online[name]) {
				if (online[name] !== ref) {
					changed = true;
				}
			} else {
				changed = true;
			}
			online[name] = ref;
		} else if (online[name]) {
			changed = true;
			delete online[name];
		}
		if (!changed) {
			return;
		}
		if (Object.keys(online).length != NAMES.length) {
			calc.onUnMount();
			Promise.resolve().then(() => m.publish(null));
			return;
		}
		calc.canvases = online;
		Promise.resolve().then(() => m.publish(calc));
	};

	const w: { [key: string]: ManageInstance<CanvasWatchNames> } = {}
	const list = NAMES.map((name: KnownNames, idx) => {
		const m = w[name] = new ManageInstance<CanvasWatchNames>({ name, ref: null });
		const WatchOnRef = () => {
			onRef(useSyncExternalStore(...m.subscribe()));
			return '';
		}
		return <Fragment key={idx}>
			<WatchCanvas key={idx} m={m} name={name} />
			<WatchOnRef />
		</Fragment>
	});

	const dw = MouseWatcher.startup(calc, fw, setTT).onNode;
	const wg = new ManageInstance(props.grid);
	const zoomAndRestorOnClick = (value: string) => {
		if (value === 'r') {
			const event = new Reset({ data: null, tag: 'reset' });
			fw.sendEvent(event, event.data);
			return;
		}
		const k = value === '+' ? .1 : -.1
		const t = { ...calc.transform };
		t.k -= k;
		calc.setTransform(t);
		const event = new OnChange({ data: calc.getChanges(), tag: value });
		fw.sendEvent(event, event.data);
	};

	return (
		<div className={`linked-node-map-RootContainer linked-node-map-${theme}`} ref={slotRef}>
			<CalculatorContext.Provider value={calc}>
				<div className={'linked-node-map-canvas-div-container'}>
					<div className={'linked-node-map-canvas-div-container'} ref={scRef}>
						<ShowGrid wg={wg} props={props} />
						{list}
					</div>
					<Draw m={m} props={props} />
					<div ref={dw} className='linked-node-map-canvas' />
				</div>
				{!props.noTools && <Tools>
					{!props.hideSearch &&
						<Search nodes={props.nodes} onClick={(node) => {
							calc.drawCenteredOnNode(node);
							const event = new OnChange({ data: calc.getChanges(), tag: `node-${node.i}` });
							event.name = 'CenterOnNode';
							fw.sendEvent(event, event.data);
						}}
						/>
					}
					{!props.hideCompass &&
						<Compass onClick={(key: string) => {
							if (COMPASS_MAP.hasOwnProperty(key)) {
								const t = { ...calc.transform };
								const size = calc.boxR * 2;
								const { x, y } = COMPASS_MAP[key];
								t.x += x * size;
								t.y += y * size;
								calc.setTransform(t);
							} else {
								calc.redoMinMax();
								const t = calc.createCenertTransform();
								calc.setTransform(t);
							}
							const tag = COMPASS_TAGS.hasOwnProperty(key) ? COMPASS_TAGS[key] : key;
							const event = new OnChange({ data: calc.getChanges(), tag });
							fw.sendEvent(event, event.data);
						}} />
					}
					{!props.hideGridToggle &&
						<GridToggle onClick={() => {
							wg.publish(calc.changes.grid = !calc.changes.grid)
							const event = new OnChange({ data: calc.getChanges(), tag: 'gtid' });
							fw.sendEvent(event, event.data);
						}} />
					}
					{!props.hideFullScreen && <ToggleFullScreen m={slotM} />}
					<ZoomAndRestore onClick={zoomAndRestorOnClick} />
					{props.showReset && 
						<div 
						title={'Undo Changes'} 
						className={`linked-node-map-ResetButton linked-node-map-${theme}`} 
						onClick={()=>zoomAndRestorOnClick('r')}>Reset</div> 
					}
				</Tools>
				}
				{tooltips}
			</CalculatorContext.Provider>
		</div>
	);
});
export { 
	FormContext, 
	LinkedMapStatus, 
	ToolTipContext, 
	ToolsContext, 
	MergeMapChanges, 
	CreateCalculatorContext, 
};
export default LinkedBundleNodeMap;
