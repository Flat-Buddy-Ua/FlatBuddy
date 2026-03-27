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
  inputGuard,
  margintop="12px",
  inputMode = "text",
  pattern = null,
  prefix = null,
  ...rest
}) {

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
  const rawValue = event?.target?.value ?? event;

  if (typeof inputGuard === "function") {
    const guardedValue = inputGuard(rawValue);
    if (guardedValue === undefined) return;
    setValue(guardedValue);
    onChange?.(guardedValue);
    return;
  }

  setValue(rawValue);
  onChange?.(rawValue);
};


  const handleFocus = (event) => {
    if (typeof onFocus === "function") onFocus(event);
  };

  const handleBlur = (event) => {
    if (typeof onBlur === "function") onBlur(event);
  };

  const baseStyle = {
    boxSizing: "border-box",
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
      <div style={{ display: "flex", alignItems: "center" }}>
        {prefix && <span style={{
          ...baseStyle,
          width: "30px",
          // marginTop: parseInt(margintop, 10) + 2 + "px",
          marginRight: "0px",
          paddingRight: "0px",
          color: "#999999",
        }}>{prefix}</span>}
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
          inputMode={inputMode}
          pattern={pattern}
        />
      </div>
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
