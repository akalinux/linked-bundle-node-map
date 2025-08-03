interface ColorOptionSet {
  color: string;
  bgColor: string;
  bundleColor: string;
  shadeColor: string;
  lineColor:string;
  fillColor:string;
  mouseOverColor:string;
}
interface ThemeOptionSets {
  [theme: string]: ColorOptionSet;
}

const THEME_MAP:ThemeOptionSets = {
  light: {
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
  }
}

export {THEME_MAP,ColorOptionSet,ThemeOptionSets}
