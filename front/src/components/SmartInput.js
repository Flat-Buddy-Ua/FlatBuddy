// SmartInput.js
import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import "./../index.css";

export function SmartInput({
  defaultValue = "",
  mask,
  maskChar = "_",
  onChange,
  onFocus,
  onBlur,
  disabled,
  margintop="12px",
  ...rest
}) {

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    const newValue = event?.target?.value ?? event;
    setValue(newValue);
    if (typeof onChange === "function") onChange(newValue);
  };

  const handleFocus = (event) => {
    if (typeof onFocus === "function") onFocus(event);
  };

  const handleBlur = (event) => {
    if (typeof onBlur === "function") onBlur(event);
  };

  const baseStyle = {
    width: "100%",
    height: "100%",
    marginTop: margintop,
    paddingLeft: "20px",
    paddingRight: "20px",
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "16px",
    fontFamily: "Inter",
    color: disabled ? "#99999966" : "#000",
    cursor: disabled ? "not-allowed" : "text",
  };

  if (!mask) {
    return (
      <input
        {...rest}
        style={{
          ...baseStyle,
          "--placeholder-color-input": disabled ? "#99999980" : "#AAAAAA"
        }}
        value={value}
        disabled={disabled}
        onChange={(e) => handleChange(e)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <InputMask
      mask={mask}
      maskChar={maskChar}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          {...rest}
          disabled={disabled}
          style={{
            ...baseStyle,
            "--placeholder-color-input": disabled ? "#99999980" : "#AAAAAA",
          }}
        />
      )}
    </InputMask>
  );
}
