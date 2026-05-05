import React, { useState } from "react";
import { SmartInput } from "./SmartInput";
import { EyeOFF, EyeON } from "./EyeComponent";
import "./PassConfirm.css";

export function PassConfirm({ value, onChange, disabled }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="pass-confirm-wrap">
            <SmartInput
                disabled={disabled}
                margintop="0px"
                placeholder="Пароль"
                type={showPassword ? "text" : "password"}
                value={typeof value === 'object' ? value?.realValue || '' : value || ''}
                onChange={onChange}
            />
            <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                disabled={disabled}
                className="pass-confirm-toggle"
            >
                {showPassword ? <EyeOFF disabled={disabled}/> : <EyeON disabled={disabled}/>}
            </button>
        </div>
    );
}
