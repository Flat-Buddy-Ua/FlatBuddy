import React, { useState } from "react";
import "./../index.css";

export function SubmitBtn({ onClick, disabled, btntext, isLoading }) {
    const [isActive, setIsActive] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const BaseBtnStyle = {
        width: "80%",
        height: "50px",
        
        border: disabled ? "2px solid #99999966" : "2px solid #111",
        color: disabled ? "#999" : "#111",
        fontSize: "18px",
        fontFamily: "'Seenonim', 'Inter', sans-serif",
        
        backgroundColor: disabled ? "transparent" : "#FCD531", 
        cursor: disabled ? "not-allowed" : "pointer",
        
        transition: "all 0.2s ease",
        
        boxShadow: disabled 
            ? "none" 
            : isActive 
                ? "none" 
                : isHovered 
                    ? "4px 4px 0px #111" 
                    : "none",
                    
        transform: disabled 
            ? "translate(0, 0)" 
            : isActive 
                ? "translate(0, 0)" 
                : isHovered 
                    ? "translate(-2px, -2px)" 
                    : "translate(0, 0)",
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
                {btntext}
            </button>

            {disabled && !isLoading && isHovered &&
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
