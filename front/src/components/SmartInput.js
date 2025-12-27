// SmartInput.js
import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import "./../index.css";

export function SmartInput({
  defaultValue = "",
  mask,
  maskChar = "_",
  onChange,   // will be called with newValue (string)
  onFocus,    // will be called with native event
  onBlur,
  disabled,     // will be called with native event
  ...rest
}) {
  // console.log("SmartInput render", { defaultValue, mask, disabled });

  const [value, setValue] = useState(defaultValue);

  // keep internal value if parent controls defaultValue change
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
    paddingLeft: "20px",
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "16px",
    fontFamily: "Inter",
    color: disabled ? "#99999966" : "#000",
    cursor: disabled ? "not-allowed" : "text",
  };

  // If no mask, render normal input but keep same contract (onChange gives string)
  if (!mask) {
    return (
      <input
        {...rest}
        style={{
          ...baseStyle,
          "--placeholder-color": disabled ? "#99999980" : "#AAAAAA"
        }}
        value={value}
        disabled={disabled}
        onChange={(e) => handleChange(e)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }

  // WITH MASK: pass handlers to InputMask (important!)
  return (
    <InputMask
      mask={mask}
      maskChar={maskChar}
      value={value}
      disabled={disabled}
      onChange={handleChange}   // InputMask will call this with event
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {(inputProps) => (
        // do NOT override inputProps.onFocus/onBlur/onChange here
        <input
          {...inputProps}
          {...rest}
          disabled={disabled}     // allow placeholder, disabled, etc.
          style={{
            ...baseStyle,
            "--placeholder-color": disabled ? "#ffff" : "#AAAAAA",
          }}
        />
      )}
    </InputMask>
  );
}
