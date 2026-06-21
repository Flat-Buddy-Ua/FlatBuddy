import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';
import { PasswordInput } from '../components/PasswordInfo.jsx';
import { PassConfirm } from '../components/PassConfirm.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import './VerifyEmail.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const STATE = {
    VERIFYING: 'verifying',
    FORM: 'form',
    SUCCESS: 'success',
    ERROR: 'error',
};

const Spinner = () => <div className="verify-spinner" />;

export default function ResetPassword() {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();

    const [state, setState] = useState(STATE.VERIFYING);
    const [errorDetail, setErrorDetail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formState, setFormState] = useState({});
    const triggered = useRef(false);

    useEffect(() => {
        if (triggered.current) return;
        triggered.current = true;

        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/reset-password/verify/${token}/`, {
                    method: 'GET',
                });
                if (res.ok) {
                    setState(STATE.FORM);
                } else {
                    const body = await res.json().catch(() => ({}));
                    setErrorDetail(body.detail || t('reset_password.invalid_token'));
                    setState(STATE.ERROR);
                }
            } catch {
                setErrorDetail(t('reset_password.network_error'));
                setState(STATE.ERROR);
            }
        })();
    }, [token]);

    const handleSubmit = async () => {
        const password = formState.password?.realValue;
        const repeat_password = formState.repeat_password?.realValue;

        if (!password || !repeat_password) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const res = await fetch(`${BASE_URL}/api/reset-password/confirm/${token}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, repeat_password }),
            });

            if (res.ok) {
                setState(STATE.SUCCESS);
                setTimeout(() => navigate('/'), 2000);
            } else {
                const body = await res.json().catch(() => ({}));
                setSubmitError(body.detail || t('reset_password.error_failed'));
            }
        } catch {
            setSubmitError(t('reset_password.network_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () =>
        formState.password?.isValid && formState.repeat_password?.isValid;

    return (
        <div className="landing-page">
            <Header />
            <div className="verify-page">
                <div className="verify-card">

                    {state === STATE.VERIFYING && (
                        <>
                            <Spinner />
                            <h2 className="verify-heading">{t('reset_password.loading')}</h2>
                            <p className="verify-note">{t('reset_password.wait')}</p>
                        </>
                    )}

                    {state === STATE.ERROR && (
                        <>
                            <div className="verify-icon">⚠️</div>
                            <h2 className="verify-heading">{errorDetail}</h2>
                            <p className="verify-note">{t('reset_password.error_note')}</p>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="verify-link-btn"
                            >
                                {t('reset_password.back_to_home')}
                            </button>
                        </>
                    )}

                    {state === STATE.FORM && (
                        <>
                            <div className="verify-icon">🔐</div>
                            <h2 className="verify-heading">{t('reset_password.title')}</h2>
                            <p className="verify-note">{t('reset_password.subtitle')}</p>

                            <div style={{ width: '100%' }}>
                                <SmartBox
                                    fieldName="password"
                                    formState={formState}
                                    setFormState={setFormState}
                                    mywidth="100%"
                                >
                                    <PasswordInput name="password" />
                                </SmartBox>
                            </div>

                            <div style={{ width: '100%' }}>
                                <SmartBox
                                    fieldName="repeat_password"
                                    formState={formState}
                                    setFormState={setFormState}
                                    disabled={!formState.password?.isValid}
                                    mywidth="100%"
                                >
                                    <PassConfirm
                                        disabled={!formState.password?.isValid}
                                        name="repeat_password"
                                    />
                                </SmartBox>
                            </div>

                            {submitError && (
                                <p className="verify-note verify-note--error">{submitError}</p>
                            )}

                            <div className="verify-submit-row">
                                <SubmitBtn
                                    onClick={handleSubmit}
                                    disabled={!isFormValid() || isSubmitting}
                                    btntext={isSubmitting ? t('reset_password.saving') : t('reset_password.submit_btn')}
                                />
                            </div>
                        </>
                    )}

                    {state === STATE.SUCCESS && (
                        <>
                            <div className="verify-icon">✅</div>
                            <h2 className="verify-heading">{t('reset_password.success')}</h2>
                            <p className="verify-note">{t('reset_password.redirecting')}</p>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}