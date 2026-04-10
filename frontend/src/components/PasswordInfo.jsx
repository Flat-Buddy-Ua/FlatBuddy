import React from "react";
import { useState } from "react";
import { SmartInput } from "./SmartInput";
import { EyeOFF, EyeON } from "./EyeComponent";

export function PasswordInput ({ value, onChange, onFocus, onBlur, name }) {
    const [showInfo, setShowInfo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
            marginRight: "12px",
            boxShadow: isActive ? "0px 0px 10px 5px #F6DDD4" : "none",
            }}
        >
            <SmartInput
                margintop="0px"
                placeholder="Пароль"
                type={showPassword ? "text" : "password"}
                name={name}
                value={typeof value === 'object' ? value?.realValue || '' : value || ''}
                onChange={onChange}
                onFocus={(e) => {
                    setIsActive(true);
                    if (onFocus) onFocus(e);
                }}
                onBlur={(e) => {
                    setIsActive(false);
                    if (onBlur) onBlur(e);
                }}
            />

            {/* кнопка show/hide password */}
            <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                    width: "40px",
                    border: "0px",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "4px",
                }}
            >
                {showPassword ? <EyeOFF /> : <EyeON />}
            </button>

            {/* кнопка i */}
            <button
                type="button"
                onClick={() => setShowInfo(prev => !prev)}
                style={{
                    width: "20px",
                    borderRadius: "50%",
                    border: "2px solid #999",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#999",
                }}
            >
                i
            </button>
    
            {/* інформаційна панель */}
            {showInfo && (
                <div
                    style={{
                        position: "absolute",
                        width: "250px",
                        top: "100%",
                        left: "210px",
                        marginTop: "6px",
                        padding: "8px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        fontSize: "12px",
                        zIndex: 10
                    }}
                >
                    <strong>Password requirements:</strong>
                    <ul style={{ margin: "6px 0", paddingLeft: "16px" }}>
                        <li>Як мінімум 8 символів</li>
                        <li>Максимум 20 символів</li>
                        <li>Щонайменше одна велика літера</li>
                        <li>Щонайменше одна мала літера</li>
                        <li>Щонайменше одна цифра</li>
                        <li>Щонайменше один спеціальний символ</li>
                    </ul>
                </div>
            )}
        </div>
    );
};
