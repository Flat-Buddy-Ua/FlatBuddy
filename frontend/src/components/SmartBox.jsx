import React, { useState, useEffect } from "react";
import { validations } from "./validations";

const VALIDATION_BY_NAME = {
    // Step 1
    first_name: "name",
    last_name: "surname",
    country: "country",
    city: "city",
    gender: "gender",
    phone_number: "phone",
    email: "email",
    password: "password",
    repeat_password: "repeat_password",
    // Step 2
    status: "status",
    orbit: "orbit",
    languages: "languages",
    cleanliness: "cleanliness",
    my_vibe: "my_vibe",
    buddy_vibe: "buddy_vibe",
    schedule: "schedule",
    sleep_schedule: "sleep_schedule",
    smoking: "smoking",
    partying: "partying",
    hobbies: "hobbies",
    // Step 3
    room_sharing_preference: "room_sharing_preference",
    preferred_gender: "preferred_gender",
    housing_status: "housing_status",
    budget_min: "budget_min",
    budget_max: "budget_max",
    destination: "destination",
    preferred_districts: "preferred_districts",
    planned_duration: "planned_duration",
    move_in_date: "move_in_date",
    has_pet: "has_pet",
    pet_description: "pet_description",
};

const detectValidationType = (children) => {
    if (!children || !children.props) return null;

    if (children.props.validationType) {
        return children.props.validationType;
    }

    const name = children.props.name || "";
    return VALIDATION_BY_NAME[name] || null;
};

export function SmartBox({ fieldName, formState, setFormState, children, disabled, mywidth="300px" }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

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
                onFocus: () => setIsFocused(true),
                onBlur: () => setIsFocused(false),
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
          
                    border: disabled
                        ? "2px solid #99999966"
                        : error
                            ? "2px solid #ff3333"
                            : isFocused
                                ? "2px solid #111"
                                : "2px solid transparent",
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