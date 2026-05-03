import React, { useState } from "react";

export function NavStep({ isActive = false, isDisabled = false, onClick, children }) {
    const [isHovered, setIsHovered] = useState(false);

    const [accentColor] = useState(() => {
        const colors = ["#F58A3D", "#FCD531"];
        return colors[Math.floor(Math.random() * colors.length)];
    });

    const showHover = !isActive && !isDisabled && isHovered;
    const liftEffect = isActive || showHover;

    return (
        <div
            onClick={!isActive && !isDisabled ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: "10px 20px",
                border: isActive ? "2px solid #111" : "2px solid #F6DDD4",
                backgroundColor: isActive ? "#FCD531" : isDisabled ? "#F7F1EE" : "transparent",
                color: isDisabled ? "#8A817C" : "#111",
                fontFamily: "'Seenonim', 'Inter', sans-serif",
                fontSize: "16px",
                cursor: isActive ? "default" : isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                transform: liftEffect ? "translate(-2px, -2px)" : "translate(0, 0)",
                boxShadow: isActive
                    ? "4px 4px 0px #111"
                    : showHover
                        ? `4px 4px 0px ${accentColor}`
                        : "none",
                opacity: isDisabled ? 0.7 : 1,
                pointerEvents: isDisabled ? "none" : "auto",
            }}
        >
            {children}
        </div>
    );
}
