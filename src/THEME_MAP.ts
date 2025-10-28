interface ColorOptionSet {
  color: string;
  bgColor: string;
  bundleColor: string;
  shadeColor: string;
  lineColor:string;
  fillColor:string;
  mouseOverColor:string;
  fill:string;
  stroke:string;
}

interface ThemeOptionSets {
  [theme: string]: ColorOptionSet;
}

export const THEME_MAP:ThemeOptionSets = {
  light: {
    stroke: 'black',
    fill: 'black',
    lineColor: 'black',
    fillColor: 'white',
    color: 'black',
    bgColor: 'white',
    bundleColor: 'darkgrey',
    shadeColor: 'lightgrey',
    mouseOverColor:'lightblue',
  },
  dark: {
    mouseOverColor:'lightblue',
    lineColor: 'white',
    fillColor: 'black',
    color: 'white',
    bgColor: 'black',
    bundleColor: 'darkgrey',
    shadeColor: 'lightgrey',
    stroke: 'white',
    fill: 'white'
  }
}

export {
	type ColorOptionSet,
	type ThemeOptionSets,
}
