// SmartInput.jsx
import React from "react";
import InputMask from "react-input-mask";
import "./SmartInput.css";

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

  const inputClass = [
    "smart-input",
    prefix && "smart-input--with-prefix",
    disabled && "smart-input--disabled",
  ].filter(Boolean).join(" ");

  const wrapStyle = { "--smart-input-margin-top": margintop };

  if (!mask) {
    return (
      <div className="smart-input-wrap" style={wrapStyle}>
        {prefix && (
          <span className="smart-input-prefix">{prefix}</span>
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
          className={inputClass}
          style={{ "--placeholder-color-input": disabled ? "#99999980" : "#AAAAAA" }}
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
        <div className="smart-input-wrap" style={wrapStyle}>
          {prefix && (
            <span className="smart-input-prefix">{prefix}</span>
          )}
          <input
            {...inputProps}
            {...rest}
            inputMode={inputMode}
            pattern={pattern}
            className={inputClass}
            style={{ "--placeholder-color-input": disabled ? "#99999980" : "#AAAAAA" }}
          />
        </div>
      )}
    </InputMask>
  );
}
