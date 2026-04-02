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
  if (name.includes("sleep_schedule")) return "sleep_schedule";
  if (name.includes("bad_habits")) return "bad_habits";
  if (name.includes("mbti")) return "mbti";
  if (name.includes("hobby")) return "hobby";
  if (name.includes("biography")) return "biography";
  if (name.includes("looking_for")) return "looking_for";

  if (name.includes("room_sharing_preference")) return "room_sharing_preference";
  if (name.includes("preferred_gender")) return "preferred_gender";
  if (name.includes("housing_status")) return "housing_status";
  if (name.includes("budget")) return "budget";
  if (name.includes("preferred_districts")) return "preferred_districts";
  if (name.includes("planned_duration")) return "planned_duration";
  if (name.includes("move_in_date")) return "move_in_date";
  if (name.includes("has_pet")) return "has_pet";
  if (name.includes("pet_description")) return "pet_description";

  return null;
};

export function SmartBox({ children, fieldName, formState, setFormState, disabled, mywidth = "300px" }) {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(children && children.props ? children.props.defaultValue || "" : "");
  const [validationType, setValidationType] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const [accentColor] = useState(() => {
    const colors = ["#F58A3D", "#FCD531"]; // Чорний, Оранжевий, Жовтий
    return colors[Math.floor(Math.random() * colors.length)];
  });

  useEffect(() => {
    const type = detectValidationType(children);
    setValidationType(type);
  }, [children]);

  const handleValueChange = (newValue) => {
    const realValue = newValue && newValue.value !== undefined ? newValue.value : newValue;

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
      const newValue = e && e.target ? e.target.value : e;
      const realValue = newValue && newValue.value !== undefined ? newValue.value : newValue;
      handleValueChange(realValue);
      if (children.props.onChange) children.props.onChange(e);
    },
    value: value,
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
          // 🟢 Змінили фон на білий (якщо хочеш лишити персиковий - поверни #F6DDD4)
          background: disabled ? "transparent" : "#F6DDD4", 
          cursor: disabled ? "not-allowed" : "text",
          // 🟢 Додаємо ефект "підстрибування" при наведенні
          transform: (isHovered || isActive) && !disabled ? "translate(-2px, -2px)" : "translate(0, 0)",
        }}
      >
        {childWithProps}
      </div>

      {error && (
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
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
