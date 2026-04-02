import React, { useEffect, useState } from "react";
import { SmartBox } from "./SmartBox.jsx";
import { SmartInput } from "./SmartInput.jsx";
import { SubmitBtn } from "./SubmitBtn.jsx";

export function LoginPopup({ isOpen, onClose, onSuccess }) {
  const [formState, setFormState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormState({});
      setSubmitError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (fieldName, value, isValid) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: {
        realValue: value,
        isValid,
      },
    }));
  };

  const email = formState.email?.realValue || "";
  const password = formState.password?.realValue || "";
  const isFormValid = Boolean(email.trim() && password.trim() && formState.email?.isValid !== false);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.detail ||
          data?.message ||
          "Не вдалося увійти. Перевірте email і пароль.";
        setSubmitError(message);
        return;
      }

      if (data?.access) localStorage.setItem("access_token", data.access);
      if (data?.refresh) localStorage.setItem("refresh_token", data.refresh);

      onSuccess?.(data);
      onClose?.();
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError("Сталася помилка під час входу. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="login-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-popup-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="login-popup__card">
        <button type="button" className="login-popup__close" onClick={onClose} aria-label="Close login popup">
          x
        </button>

        <div className="login-popup__header">
          <h2 id="login-popup-title" className="login-popup__title">
            Log In
          </h2>
          <p className="login-popup__subtitle">Увійдіть у свій FlatBuddy профіль</p>
        </div>

        <div className="login-popup__form">
          <div>
            <div style={labelStyle}>Email</div>
            <SmartBox
              fieldName="email"
              formState={formState}
              setFormState={handleFieldChange}
              mywidth="100%"
            >
              <SmartInput
                placeholder="Електронна пошта"
                name="login_email"
                type="email"
              />
            </SmartBox>
          </div>

          <div>
            <div style={labelStyle}>Пароль</div>
            <SmartBox
              fieldName="password"
              formState={formState}
              setFormState={handleFieldChange}
              mywidth="100%"
            >
              <SmartInput
                placeholder="Пароль"
                name="login_password"
                type="password"
                validationType=""
              />
            </SmartBox>
          </div>
        </div>

        {submitError ? <div className="login-popup__error">{submitError}</div> : null}

        <div className="login-popup__actions">
          <SubmitBtn
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            btntext={isSubmitting ? "Входимо..." : "Увійти"}
          />
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  marginBottom: 8,
  fontSize: 18,
  fontFamily: "Seenonim",
  color: "#000",
};
