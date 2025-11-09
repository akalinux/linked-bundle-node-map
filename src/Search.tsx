/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useSyncExternalStore, useContext, useState, useRef, useEffect } from "react";
import ManageInstance from "./ManageInstance";
import ThemeContext from "./ThemeContext";
import CalculatorContext from "./CalculatorContext";
import { NodeEl } from "./CommonTypes";

function DrawDDNode(props: { node: NodeEl, m: ManageInstance<string>, onClick: (node: NodeEl) => void }) {
	const { node, m, onClick } = props;
	const theme = useContext(ThemeContext);
	const ref: React.RefObject<null | HTMLDivElement> = useRef(null);
	const l = node.l.toLocaleLowerCase();
	const Watcher = () => {
		const cmp = useSyncExternalStore(...m.subscribe()).toLocaleLowerCase();
		const show = (!cmp || l.indexOf(cmp) != -1);
		useEffect(() => {
			if (!(ref && ref.current)) return;
			ref.current.style.display = show ? 'block' : 'none'
		}, [ref]);
		if (!(ref && ref.current)) return;
		ref.current.style.display = show ? 'block' : 'none'
		return '';
	}
	return <>
		<div onClick={() => onClick(node)} className={`linked-node-map-ddRowStyle linked-node-map-${theme}`} ref={ref}>
			{node.l}
		</div>
		<Watcher />
	</>
}


export default function Search(props: { nodes: NodeEl[], onClick: (node: NodeEl) => void }) {
	const { nodes, onClick } = props;
	const icalc = useContext(CalculatorContext);
	const { fill, stroke } = icalc;
	const theme = useContext(ThemeContext);

	const ms: { [key: string]: any } = {
		fill,
		width: '33px',
		height: '33px',
	};
	const ds: { [key: string]: any } = {
		borderWidth: '1.5px',
		borderStyle: 'solid',
		width: '35px',
		height: '35px',
		position: 'relative',
	};
	const sb: { [key: string]: any } = {
		border: 'solid 1.5px',
		position: 'absolute',
		width: '175px',
		right: '0px',
		top: '-1.5px',
		height: '25px',
	}
	const m = new ManageInstance('');
	let to: any;
	useEffect(() => {
		return () => clearTimeout(to);
	})
	const Input = () => {
		const [text, setText] = useState('')

		return <input type="text" value={text} onChange={(e) => {
			const value = (e.target.value + '').replace(/(^\s+|\s+)/g, '');
			setText(value);
			clearTimeout(to);
			to = setTimeout(() => {
				m.publish(value);
			}, 300);
		}} />
	}
	const list = [];

	for (let idx = 0; idx < nodes.length; ++idx) {
		list.push(<DrawDDNode key={idx} node={nodes[idx]} m={m} onClick={onClick} />)
	}
	return <div className={`linked-node-map-SearchContainer linked-node-map-${theme}`} style={ds}>
		<svg viewBox="0 0 24 24" stroke={stroke} fill={fill}>
			<path style={ms} d="M9.5,3C13.09,3 16,5.91 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16C5.91,16 3,13.09 3,9.5C3,5.91 5.91,3 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
		</svg>
		<div className="linked-node-map-SearchBox">
			<div className="linked-node-map-relativeTag">
				<div className={`$linked-node-map-{theme}`} style={sb}>
					<div className='linked-node-map-SearchContainer'>
						<Input />
						<div className={`linked-node-map-SearchBarDD ${theme}`}>{list}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}
