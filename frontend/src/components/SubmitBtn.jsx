import React from "react";
import "./SubmitBtn.css";

export function SubmitBtn({ onClick, disabled, btntext, isLoading }) {
    return (
        <div className="submit-btn-wrap">
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className="submit-btn"
            >
                {btntext}
            </button>
        </div>
    );
}
