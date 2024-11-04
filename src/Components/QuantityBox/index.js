import { FaMinus, FaPlus } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { useState, useEffect, useCallback } from "react";
import _ from "lodash";

const QuantityBox = ({ initialQuantity, onQuantityChange }) => {
  const [inputVal, setInputVal] = useState(initialQuantity);

  const minus = () => {
    if (inputVal > 1) {
      setInputVal(inputVal - 1);
    }
  };

  const plus = () => {
    setInputVal(inputVal + 1);
  };

  const debouncedOnQuantityChange = useCallback(
    _.debounce((newVal) => {
      if (onQuantityChange) {
        onQuantityChange(newVal);
      }
    }, 300), // Debounce time in milliseconds
    [onQuantityChange]
  );

  useEffect(() => {
    debouncedOnQuantityChange(inputVal);
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="quantityDrop d-flex align-items-center">
      <Button onClick={minus}>
        <FaMinus />
      </Button>
      <input type="text" value={inputVal} readOnly />
      <Button onClick={plus}>
        <FaPlus />
      </Button>
    </div>
  );
};

export default QuantityBox;
