import React, { useState, useEffect } from "react";
import { validations } from "./validations";
import "./SmartBox.css";

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

export function SmartBox({ fieldName, formState, setFormState, children, disabled, mywidth = "300px" }) {
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

    // Cross-field валідація: repeat_password читає formState.password.
    // Слухаємо тільки ці два поля, щоб не тригеритись на кожну зміну будь-чого
    // у formState (це створювало нескінченний cascade setState / React error #185).
    const crossDepRealValue = validationType === 'repeat_password' ? formState?.password?.realValue : null;
    const crossDepIsValid   = validationType === 'repeat_password' ? formState?.password?.isValid   : null;

    useEffect(() => {
        if (!validationType || !validations[validationType]) return;

        let nextIsValid;
        let nextError;
        if (value === "") {
            nextIsValid = true;
            nextError = null;
        } else {
            const errorMsg = validations[validationType](value, formState);
            nextIsValid = errorMsg === null;
            nextError = errorMsg;
        }

        const currIsValid = fieldData.isValid ?? true;
        const currError   = fieldData.localError ?? null;
        if (nextIsValid === currIsValid && nextError === currError) return;

        setFormState((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                isValid: nextIsValid,
                localError: nextError,
            },
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, validationType, fieldName, fieldData, crossDepRealValue, crossDepIsValid]);

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

    const innerClass = [
        'smart-box-inner',
        disabled && 'smart-box-inner--disabled',
        error && 'smart-box-inner--error',
        isFocused && !error && !disabled && 'smart-box-inner--focused',
    ].filter(Boolean).join(' ');

    return (
        <div className="smart-box-root">
            <div
                className={innerClass}
                style={{
                    '--smart-box-width': mywidth,
                    '--smart-box-accent': accentColor,
                }}
            >
                {childWithProps}
            </div>

            {errorText && (
                <div className="smart-box-error-popover">{errorText}</div>
            )}
        </div>
    );
}
