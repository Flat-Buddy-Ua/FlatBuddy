import React, { useState } from "react";
import "./../index.css";

export function SubmitBtn({ onClick, disabled}) {
    const [isActive, setIsActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const BaseBtnStyle = {
        width: "75%",
        height: "50px",
        border: "none",
        color: disabled ? "#999" : "#000",
        fontSize: "16px",
        fontFamily: "Inter",
        cursor: "pointer",
        boxShadow: isHovered || isActive ? disabled ? "0px 0px 10px 5px #99999966" : "0px 0px 10px 5px #F6DDD4" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: disabled ? "white": "#F6DDD4",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.3s ease",
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                style={BaseBtnStyle}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onMouseLeave={() => setIsActive(false)}
            >
                Далі
            </button>

            {disabled && isHovered &&
                <div style={{
                        position: "absolute",
                        bottom: "-22px",
                        left: "50%-75px",
                        color: "red",
                        fontSize: "12px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: "500",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: "3px 8px",
                        zIndex: 12,
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        Перевірте коректність заповнення форми
                </div>
        }
        </div>
    );
}
