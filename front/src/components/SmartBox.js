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
  if (stringValue.includes("@") || placeholder.includes("Email")) {
    return "email";
  }
  if (stringValue === "Тарас" || stringValue.includes("Тарас") || 
      placeholder.includes("Тарас") || placeholder.includes("Ім'я")) {
    return "name";
  }
  if (stringValue === "Шевченко" || stringValue.includes("Шевченко") || 
      placeholder.includes("Шевченко") || placeholder.includes("Прізвище")) {
    return "surname";
  }
  if (stringValue === "Україна" || stringValue.includes("Україна") || 
      placeholder.includes("країна") || placeholder.includes("Країна")) {
    return "country";
  }
  if (placeholder.includes("телефон") || placeholder.includes("Телефон")) {
    return "phone";
  }
  if (placeholder.includes("дата") || placeholder.includes("Дата")) {
    return "birthDate";
  }

  if (mask.includes("+38(099)-999-99-99")) return "phone";

  if (placeholder.includes("password")) {
    return "password";
  }
  if (placeholder.includes("passConfirm")) {
    return "passwordConfirm";
  }

  
  return null;
};

export function SmartBox({ children, fieldName, formState, setFormState, disabled }) {
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
      let validationError = null;
      if (validationType && validations[validationType]) {
        validationError = validations[validationType](newValue, formState);
      }
      const isValid = !validationError;

      setFormState(fieldName, newValue, isValid);
      setValue(newValue);
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
            handleValueChange(newValue);
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
                    width: "300px", 
                    height: "50px",
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
