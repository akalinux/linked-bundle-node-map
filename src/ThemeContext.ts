import React,{createContext} from "react";
const ThemeContext:React.Context<string>=React.createContext('light');
export default ThemeContext;
export { ThemeContext }
