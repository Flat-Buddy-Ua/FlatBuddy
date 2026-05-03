// SmartText.js
import React from "react";
import "./../index.css";

export function SmartText({
	value,
	defaultValue = "",
	onChange,
	onFocus,
	onBlur,
	disabled,
	...rest
}) {

	const displayValue = value !== undefined ? value : defaultValue;

	const handleChange = (event) => {
		// Auto-grow textarea height
		event.target.style.height = "24px";
		event.target.style.height = event.target.scrollHeight + "px";

		const newValue = event?.target?.value ?? event;
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
			value={displayValue || ""}
			disabled={disabled}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	);
}
