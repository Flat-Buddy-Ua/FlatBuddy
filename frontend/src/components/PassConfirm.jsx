import React, { useState } from "react";
import { SmartInput } from "./SmartInput";
import { EyeOFF, EyeON } from "./EyeComponent";

export function PassConfirm({ value, onChange, disabled }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
            marginRight: "12px",
            }}
        >
            <SmartInput
                disabled={disabled}
                margintop="0px"
                placeholder="Пароль"
                type={showPassword ? "text" : "password"}
                value={typeof value === 'object' ? value?.realValue || '' : value || ''}
                onChange={onChange}
            />  
            {/* кнопка show/hide password */}
            <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                disabled={disabled}
                style={{
                    width: "40px",
                    border: "0px",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "4px",
                }}
            >
                {showPassword ? <EyeOFF disabled={disabled}/> : <EyeON disabled={disabled}/>}
            </button>   
        </div>
    );
}