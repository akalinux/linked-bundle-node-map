import { FC,useContext } from 'react';
import ThemeContext from './ThemeContext';
import React from 'react';
interface Testme {
	
}
const TestMe : FC<Testme>=function() {
	console.log(window.React===React,window,React,React);
	const theme=useContext(ThemeContext);
	return <>{theme}</>
}

export default function StandAlone() {

	return <ThemeContext.Provider value="light"><TestMe /></ThemeContext.Provider>
}
export {ThemeContext} from './ThemeContext'