import React, { useState } from "react";

export function SmartBox({ children }) {

    const [isActive, setIsActive] = React.useState(false);

    // Клонюємо дочірній елемент, щоб прокинути onFocus/onBlur
    const childWithProps = React.cloneElement(children, {
        onFocus: (e) => {
            setIsActive(true);
            if (children.props.onFocus) children.props.onFocus(e);
        },
        onBlur: (e) => {
            setIsActive(false);
            if (children.props.onBlur) children.props.onBlur(e);
        }
    });

    return (
        <div
            style={{
                width: "300px",
                height: "50px",
                // padding: "0px 16px",
                alignItems: "center",
                transition: "0.2s ease",
                boxShadow: isActive ? "0px 0px 10px 5px #F6DDD4" : "none",
                border: isActive ? "2px solid #F6DDD4" : "2px solid transparent",
                background: isActive ? "#F6DDD4" : "#F6DDD4",

            }}
        >
            {childWithProps}
        </div>
    );
}