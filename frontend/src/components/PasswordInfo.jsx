import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SmartInput } from "./SmartInput";
import { EyeOFF, EyeON } from "./EyeComponent";
import "./PasswordInfo.css";

export function PasswordInput({ value, onChange, onFocus, onBlur, name, hideInfo = false }) {
    const { t } = useTranslation();
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
                placeholder={t("password_info.placeholder", "Пароль")}
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
                            <strong>{t("password_info.requirements_title")}</strong>
                            <ul>
                                <li>{t("password_info.req_min_len")}</li>
                                <li>{t("password_info.req_max_len")}</li>
                                <li>{t("password_info.req_upper")}</li>
                                <li>{t("password_info.req_lower")}</li>
                                <li>{t("password_info.req_digit")}</li>
                                <li>{t("password_info.req_special")}</li>
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
