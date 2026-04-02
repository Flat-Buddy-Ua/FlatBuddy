// SmartText.js
import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import "./../index.css";

export function SmartText({
	defaultValue = "",
	mask,
	maskChar = "_",
	onChange,
  	onFocus,
  	onBlur,
  	disabled,
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
		boxSizing: "border-box",
		lineHeight: "20px",
		resize: "none",
		overflow: "hidden",
    	width: "100%",
  		margin: "8px 0 8px",
  		padding: "6px 20px",
    	// border: "2px solid #000000",
		border: "none",
    	background: "transparent",
    	outline: "none",
    	fontSize: "16px",
    	fontFamily: "Inter",
    	color: disabled ? "#99999966" : "#000",
    	cursor: disabled ? "not-allowed" : "text",
		height: "24px",
		minHeight: "24px",
  	};

  	return (
      		<textarea
        		{...rest}
        		style={{
          			...baseStyle,
          			"--placeholder-color-text": disabled ? "#99999980" : "#AAAAAA",
        		}}
        		value={value}
        		disabled={disabled}
        		onChange={(e) => {
					e.target.style.height = "24px";
					e.target.style.height = e.target.scrollHeight + "px";
          			handleChange(e)}}
        		onFocus={handleFocus}
        		onBlur={handleBlur}
      		/>
    );
}
