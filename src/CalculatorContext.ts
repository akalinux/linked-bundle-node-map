import Calculator from "./Calculator";
import { createContext } from "react";

const CalculatorContext: React.Context<Calculator> = createContext(new Calculator());
export default CalculatorContext;