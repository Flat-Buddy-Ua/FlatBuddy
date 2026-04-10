// SmartInput.jsx
import React from "react";
import InputMask from "react-input-mask";
import "./../index.css";

export function SmartInput({
  value,
  defaultValue = "",
  mask,
  maskChar = "_",
  onChange,
  onFocus,
  onBlur,
  disabled,
  inputGuard,
  margintop = "14px",
  inputMode = "text",
  pattern = null,
  prefix = null,
  hasError,
  ...rest
}) {
  
  const displayValue = value !== undefined ? value : defaultValue;

  const handleChange = (event) => {
    const rawValue = event?.target?.value ?? event;

    if (typeof inputGuard === "function") {
      const guardedValue = inputGuard(rawValue);
      if (guardedValue === undefined) return;
      onChange?.(guardedValue);
      return;
    }

    onChange?.(event);
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
    paddingLeft: prefix ? "0px" : "20px",
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
        {prefix && (
          <span
            style={{
              ...baseStyle,
              width: "30px",
              marginRight: "0px",
              paddingRight: "0px",
              color: "#999999",
            }}
          >
            {prefix}
          </span>
        )}
        <input
          {...rest}
          value={displayValue || ""}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          inputMode={inputMode}
          pattern={pattern}
          style={{
            ...baseStyle,
            "--placeholder-color-input": disabled ? "#99999980" : "#AAAAAA",
          }}
        />
      </div>
    );
  }

  return (
    <InputMask
      mask={mask}
      maskChar={maskChar}
      value={displayValue}
      disabled={disabled}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {(inputProps) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {prefix && (
            <span
              style={{
                ...baseStyle,
                width: "30px",
                marginRight: "0px",
                paddingRight: "0px",
                color: "#999999",
              }}
            >
              {prefix}
            </span>
          )}
          <input
            {...inputProps}
            {...rest}
            style={{
              ...baseStyle,
              "--placeholder-color-input": disabled ? "#99999980" : "#AAAAAA",
            }}
            inputMode={inputMode}
            pattern={pattern}
          />
        </div>
      )}
    </InputMask>
  );
}