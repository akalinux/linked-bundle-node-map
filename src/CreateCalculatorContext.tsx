import {createContext} from 'react';
import Calculator from './Calculator';

const CreateCalculatorContext=createContext(function() { return new Calculator() });
export default CreateCalculatorContext;