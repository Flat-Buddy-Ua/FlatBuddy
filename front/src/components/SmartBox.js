import React, { useState, useEffect } from "react";
import { validations } from './validations';

const detectValidationType = (children) => {
  // Якщо передано явно
  if (children.props.validationType) {
    return children.props.validationType;
  }
  
  // Отримуємо значення БЕЗПЕЧНО
  const defaultValue = children.props.defaultValue || "";
  const placeholder = children.props.placeholder || "";
  const mask = children.props.mask || "";
  
  // Перетворюємо об'єкт в рядок (для SmartSelect)
  let stringValue = "";
  
  if (typeof defaultValue === 'string') {
    stringValue = defaultValue;
  } else if (defaultValue && typeof defaultValue === 'object') {
    // Для SmartSelect: { value: "ua", label: "Україна" }
    stringValue = defaultValue.label || defaultValue.value || "";
  }
  
  // Перевірка за значенням
  if (placeholder.includes("Тарас")) { return "name"; }
  if (placeholder.includes("Шевченко")) { return "surname"; }
  if (placeholder.includes("Країна")) { return "country"; }
  if (placeholder.includes("Місто")) { return "city"; }
  if (placeholder.includes("Стать")) { return "gender"; }
  if (mask.includes("+38(099)-999-99-99")) { return "phone"; }
  if (placeholder.includes("Email")) { return "email"; }
  if (placeholder.includes("repeat_password")) { return "repeat_password"; }
  if (placeholder.includes("password")) { return "password"; }
  
  if (placeholder.includes("університет")) { return "university"; }
  if (placeholder.includes("науки")) { return "faculty"; }
  if (placeholder.includes("курс")) { return "course"; }
  if (placeholder.includes("languages")) { return "languages"; }
  if (placeholder.includes("охайність")) { return "cleanliness"; }
  if (placeholder.includes("розклад")) { return "schedule"; }
  if (placeholder.includes("стиль")) { return "style_of_life"; }
  if (placeholder.includes("сну")) { return "sleep_schedule"; }
  if (placeholder.includes("шкідливі")) { return "bad_habits"; }
  if (placeholder.includes("MBTI")) { return "mbti"; }
  if (placeholder.includes("хоббі")) { return "hobby"; }
  if (placeholder.includes("Біографія")) { return "biography"; }
  if (placeholder.includes("buddy")) { return "looking_for"; }

  return null;
};

export function SmartBox({ children, fieldName, formState, setFormState, disabled, mywidth="300px" }) {
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState(null);
    const [value, setValue] = useState(
      children && children.props ? children.props.defaultValue || "" : ""
    );
    const [validationType, setValidationType] = useState(null);
    const [isHovered, setIsHovered] = useState(false);



    useEffect(() => {
      const type = detectValidationType(children);
      setValidationType(type);
    }, [children]);

    const handleValueChange = (newValue) => {
      const realValue = newValue && newValue.value !== undefined ? newValue.value : newValue;

      // console.log(`Handling value change for field "${fieldName}" with value:`, realValue);

      let validationError = null;
      if (validationType && validations[validationType]) {
        validationError = validations[validationType](newValue, formState);
      }
      const isValid = !validationError;

      setFormState(fieldName, realValue, isValid);
      setValue(realValue);
      setError(validationError);
    };

    const childWithProps = React.cloneElement(children, {
        onFocus: (e) => {
            setIsActive(true);
            if (children.props.onFocus) children.props.onFocus(e);
        },
        onBlur: (e) => {
            setIsActive(false);
            if (children.props.onBlur) children.props.onBlur(e);
        },
        onChange: (e) => {
            const newValue = e.target ? e.target.value : e;
            const realValue = newValue && newValue.value !== undefined ? newValue.value : newValue;
            handleValueChange(realValue);
            if (children.props.onChange) children.props.onChange(e);
        },
        value: value
    });

    return (
        <div style={{ position: "relative", width: "100%" }}>

            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: {mywidth}, 
                    minHeight: "50px",
                    height: "auto",
                    alignItems: "center",
                    transition: "0.2s ease",
                    boxShadow: error ? "0px 0px 10px 5px #ff3333" : isHovered || isActive ? disabled ? "0px 0px 10px 5px #99999966" : "0px 0px 10px 5px #F6DDD4" : "none",
                    border: disabled ? "2px solid #99999966" : isActive ? "2px solid #F6DDD4" : "2px solid transparent",
                    background: disabled ? "transparent" : "#F6DDD4",
                    cursor: disabled ? "not-allowed" : "text",

                }}
            >
                {childWithProps}
            </div>

            {error && (
                    <div style={{
                        position: "absolute",
                        bottom: "-22px",
                        left: "16px",
                        color: "red",
                        fontSize: "12px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: "500",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        zIndex: 10,
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        {error}
                    </div>
            )}
        </div>
    );
}
