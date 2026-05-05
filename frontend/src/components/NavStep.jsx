import React, { useState } from "react";
import "./NavStep.css";

export function NavStep({ isActive = false, isDisabled = false, onClick, children }) {
    const [accentColor] = useState(() => {
        const colors = ["#F58A3D", "#FCD531"];
        return colors[Math.floor(Math.random() * colors.length)];
    });

    const classes = [
        'nav-step',
        isActive && 'nav-step--active',
        isDisabled && 'nav-step--disabled',
    ].filter(Boolean).join(' ');

    return (
        <div
            onClick={!isActive && !isDisabled ? onClick : undefined}
            className={classes}
            style={{ '--nav-step-accent': accentColor }}
        >
            {children}
        </div>
    );
}
