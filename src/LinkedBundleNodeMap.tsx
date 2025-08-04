import React, { useContext, useRef, forwardRef } from 'react';
import Calculator, { SetCalculatorData } from './Calculator';
import ManageInstance from './ManageInstance';
import CalculatorContext from './CalculatorContext';
import FormContext from './FormContext';
const LinkedBundleNodeMap = forwardRef<HTMLDivElement, SetCalculatorData>((props, slotRef) => {
  const fc = useContext(FormContext);

  const calc = new Calculator();
  calc.setData(props);
  const slotM = new ManageInstance(slotRef as React.RefObject<HTMLDivElement>);
  fc.setSlotRefWatcher(slotM);

  return (
    <div ref={slotRef}>
      <CalculatorContext.Provider value={calc}>
      </CalculatorContext.Provider>
    </div>
  );
});

export default LinkedBundleNodeMap;
