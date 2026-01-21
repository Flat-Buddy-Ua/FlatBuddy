import React from "react";

export function SmartToggle({ checked, onChange, disabled }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: "none" }}
      />

      <span
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          margin: "0 8px 0 8px",
          background: checked ? "#F6DDD4" : "#ccc",
          position: "relative",
          transition: "0.2s",
          opacity: disabled ? 0.5 : 1
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 2,
            left: checked ? 20 : 2,
            transition: "0.2s"
          }}
        />
      </span>
    </label>
  );
}