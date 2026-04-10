import React, { useState, useEffect } from "react";
import { validations } from "./validations";

const detectValidationType = (children) => {
    if (!children || !children.props) return null;

    if (children.props.validationType) {
        return children.props.validationType;
    }

    const name = children.props.name || "";

    if (name.includes("first_name")) return "name";
    if (name.includes("last_name")) return "surname";
    if (name.includes("country")) return "country";
    if (name.includes("city")) return "city";
    if (name.includes("gender")) return "gender";
    if (name.includes("phone_number")) return "phone";
    if (name.includes("email")) return "email";
    if (name.includes("repeat_password")) return "repeat_password";
    if (name.includes("password")) return "password";

    if (name.includes("university")) return "university";
    if (name.includes("faculty")) return "faculty";
    if (name.includes("course")) return "course";
    if (name.includes("languages")) return "languages";
    if (name.includes("cleanliness")) return "cleanliness";
    if (name.includes("schedule")) return "schedule";
    if (name.includes("style_of_life")) return "style_of_life";
    if (name.includes("guests")) return "guests";
    if (name.includes("smoking")) return "smoking";
    if (name.includes("pets")) return "pets";
    if (name.includes("hobby")) return "hobby";

    return null;
};

export function SmartBox({ fieldName, formState, setFormState, children, disabled, mywidth="300px" }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const [accentColor] = useState(() => {
        const colors = ["#F58A3D", "#FCD531"];
        return colors[Math.floor(Math.random() * colors.length)];
    });

    const validationType = detectValidationType(children);

    const fieldData = formState?.[fieldName] || {};
    const value = fieldData.realValue || "";
    const isValid = fieldData.isValid ?? true;
    const localError = fieldData.localError;
    const backendError = fieldData.backendError || fieldData.errorText;

    
    const errorText = backendError || (value && !isValid ? localError : null);
    const error = !!errorText;

    useEffect(() => {
        if (validationType && validations[validationType] && value !== "") {
            const errorMsg = validations[validationType](value, formState);

            const validationResult = {
                isValid: errorMsg === null,
                error: errorMsg,
            };

            if (
                fieldData.isValid === undefined ||
                validationResult.isValid !== isValid ||
                validationResult.error !== localError
            ) {
                setFormState((prev) => ({
                    ...prev,
                    [fieldName]: {
                        ...prev[fieldName],
                        isValid: validationResult.isValid,
                        localError: validationResult.error,
                    },
                }));
            }
        } else if (value === "" && !isValid) {
            setFormState((prev) => ({
                ...prev,
                [fieldName]: {
                    ...prev[fieldName],
                    isValid: true,
                    localError: null,
                },
            }));
        }
    }, [value, validationType, fieldName, isValid, localError, setFormState, formState]);

    const handleChange = (e) => {
        const newValue = e && e.target ? e.target.value : e;
    
        setFormState((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                realValue: newValue,
                backendError: null,
                errorText: null,
            },
        }));
    };
    
    const childWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                value,
                onChange: handleChange,
                disabled,
                hasError: error ? "true" : undefined,
            });
        }
        return child;
    });
    
    return (
        <div style={{ position: "relative", width: "100%" }}>
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: mywidth,
                    minHeight: "50px",
                    height: "auto",
                    alignItems: "center",
                    transition: "all 0.2s ease", 
                    boxShadow: error
                        ? "4px 4px 0px #ff3333"
                        : isHovered || isActive
                            ? disabled
                                ? "none" 
                                : `4px 4px 0px ${accentColor}`
                            : "none",
          
                    border: disabled ? "2px solid #99999966" : error ? "2px solid #ff3333" : "2px solid transparent", 
                    background: disabled ? "transparent" : "#F6DDD4", 
                    cursor: disabled ? "not-allowed" : "text",
                    transform: (isHovered || isActive) && !disabled ? "translate(-2px, -2px)" : "translate(0, 0)",
                }}
            >
                {childWithProps}
            </div>

            {errorText && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "-22px",
                        left: "16px",
                        color: "red",
                        fontSize: "12px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: "500",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: "3px 8px",
                        zIndex: 10,
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                >
                    {errorText}
                </div>
            )}
        </div>
    );
}