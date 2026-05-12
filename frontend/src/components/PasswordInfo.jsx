import React, { useState } from "react";
import { SmartInput } from "./SmartInput";
import { EyeOFF, EyeON } from "./EyeComponent";
import "./PasswordInfo.css";

export function PasswordInput ({ value, onChange, onFocus, onBlur, name, hideInfo = false }) {
    const [showInfo, setShowInfo] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const wrapClass = [
        "password-input-wrap",
        isActive && "password-input-wrap--active",
    ].filter(Boolean).join(" ");

    return (
        <div className={wrapClass}>
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

            <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="password-toggle-btn"
            >
                {showPassword ? <EyeOFF /> : <EyeON />}
            </button>

            {!hideInfo && (
                <>
                    <button
                        type="button"
                        onClick={() => setShowInfo(prev => !prev)}
                        className="password-info-btn"
                    >
                        i
                    </button>

                    {showInfo && (
                        <div className="password-info-popover">
                            <strong>Password requirements:</strong>
                            <ul>
                                <li>Як мінімум 8 символів</li>
                                <li>Максимум 20 символів</li>
                                <li>Щонайменше одна велика літера</li>
                                <li>Щонайменше одна мала літера</li>
                                <li>Щонайменше одна цифра</li>
                                <li>Щонайменше один спеціальний символ</li>
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
