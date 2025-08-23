import React, { useContext, forwardRef, useRef, useEffect, useSyncExternalStore, Fragment, useMemo } from 'react';
import Calculator, { SetCalculatorData } from './Calculator';
import ManageInstance from './ManageInstance';
import CalculatorContext from './CalculatorContext';
import FormContext from './FormContext';
import { CanvasSets } from './CommonTypes';
import ThemeContext from './ThemeContext';
import MouseWatcher from './MouseWatcher';
import CreateTT from './CreateTT';
import Grid from './Grid';
import Tools from './Tools';
import ToggleFullScreen from './ToggleFullScreen';
import Search from './Search';
const COMPASS_MAP = {
  n: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  e: { x: 1, y: 0 },
  w: { x: -1, y: 0 },
}
const containerStyle: React.CSSProperties = { position: 'relative', width: '100%', height: '100%' }
const canvasStyle: React.CSSProperties = { ...containerStyle, overflow: 'hidden' }
const styleAbs: React.CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
};


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
  style?: { [key: string]: any },
}

function WatchCanvas(props: RefWatch) {
  const { m, style, name } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const send = { ref: (ref && ref.current ? ref.current : null), name }
    m.publish(send);
  }, [ref])
  const send = { ref: (ref && ref.current ? ref.current : null), name }
  m.publish(send);
  return <canvas style={style} ref={ref} />
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

const LinkedBundleNodeMap = forwardRef<HTMLDivElement, SetCalculatorData>((props, slotRef) => {
  const theme = useContext(ThemeContext);
  const fw = useContext(FormContext)
  const [setTT, tooltips] = useMemo(
    () => {
      return CreateTT({ absolute: true, needsOffset: true, offsetLeft: -5, offsetTop: -5 })
    }, []
  );
  const online: CanvasSets = { ctrl: null, bundles: null, links: null, animations: null, nodes: null };
  const calc = new Calculator();
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
      <WatchCanvas key={idx} style={styleAbs} m={m} name={name} />
      <WatchOnRef />
    </Fragment>
  });

  const dw = MouseWatcher.startup(calc, fw, setTT).onNode;
  const wg = new ManageInstance(props.grid);


  return (
    <div style={containerStyle} className={theme} ref={slotRef}>
      <CalculatorContext.Provider value={calc}>
        <div style={canvasStyle}>
          <div style={canvasStyle}>
            <ShowGrid wg={wg} props={props} />
            {list}
          </div>
          <Draw m={m} props={props} />
          <div ref={dw} style={styleAbs} />
        </div>
        {props.noTools ? '' : <Tools>
          <ToggleFullScreen m={slotM} />
          <Search nodes={props.nodes} onClick={(node) => {
            calc.drawCenteredOnNode(node);
            const data = calc.getChanges();
          }}
          />
        </Tools>
        }
      </CalculatorContext.Provider>
      {tooltips}
    </div>
  );
});

export default LinkedBundleNodeMap;
