// SmartText.jsx
import React from "react";
import "./SmartText.css";

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

	return (
		<textarea
			{...rest}
			className="smart-text"
			style={{ "--placeholder-color-text": disabled ? "#99999980" : "#AAAAAA" }}
			value={displayValue || ""}
			disabled={disabled}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	);
}
