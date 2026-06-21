import React, { PureComponent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import i18n from 'i18next';

import { SmartSelect } from '../components/SmartSelect.jsx';
import { SmartInput } from '../components/SmartInput.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import { SmartCreatable } from '../components/SmartCreatable.jsx';
import { CityOptions } from '../components/CityOptions.jsx';
import { Header } from '../components/Header.jsx';
import { SmartCalendar } from '../components/SmartCalendar.jsx';
import { PasswordInput } from '../components/PasswordInfo.jsx';
import { PassConfirm } from '../components/PassConfirm.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';
import { CitySelector } from '../components/CitySelector.jsx';
import { NavStep } from '../components/NavStep.jsx';

import { fetchWithAuth } from '../utils/api.js';

function buildRegistrationPayload(formState) {
	const result = {};
	Object.keys(formState).forEach((key) => {
		let value = formState[key].realValue;
		if (value && typeof value === 'object' && value.value !== undefined) {
			value = value.value;
		}

		if (key === 'birthdate' && value) {

			// Варіант А: Дата прийшла як європейський рядок (DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY)
			if (typeof value === 'string' && value.match(/^\d{2}[./-]\d{2}[./-]\d{4}$/)) {
				const parts = value.split(/[./-]/);
				const day = parts[0];
				const month = parts[1];
				const year = parts[2];
				value = `${year}-${month}-${day}`;
			}
			// Варіант Б: Дата прийшла як об'єкт з кастомного календаря
			else if (typeof value === 'object' && value.year && value.month && value.day) {
				const monthNum = typeof value.month === 'object' ? value.month.number : value.month;
				const month = String(monthNum).padStart(2, '0');
				const day = String(value.day).padStart(2, '0');
				value = `${value.year}-${month}-${day}`;
			}
			// Варіант В: Це стандартний JS-рядок (напр. "2006-08-29T21:00:00.000Z")
			else {
				const dateObj = new Date(value);
				if (!isNaN(dateObj)) {
					const year = dateObj.getFullYear();
					const month = String(dateObj.getMonth() + 1).padStart(2, '0');
					const day = String(dateObj.getDate()).padStart(2, '0');
					value = `${year}-${month}-${day}`;
				}
			}
		}

		result[key] = value;
	});
	return result;
}

const REQUIRED_FIELDS = [
	"first_name", "last_name",
	"country", "city",
	"gender", "birthdate",
	"phone_number", "email",
	"password", "repeat_password"
];

const COUNTRY_OPTIONS = [
	{ value: 1, label: "Україна" }
];

const GENDER_OPTIONS = [
	{ value: 1, get label() { return i18n.t('step1.gender_male'); } },
	{ value: 2, get label() { return i18n.t('step1.gender_female'); } },
	{ value: 3, get label() { return i18n.t('step1.gender_other'); } },
];


export default function Step1({ isEditing }) {
	const { t } = useTranslation();
	const [formState, setFormState] = React.useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [pendingVerification, setPendingVerification] = useState(null); // null | { email }
	const [resendStatus, setResendStatus] = useState({ kind: null, text: '' });
	const [isResending, setIsResending] = useState(false);
	const BASE_URL = import.meta.env.VITE_API_URL;
	const MAPBOX = import.meta.env.VITE_MAPBOX_TOKEN;
	const navigate = useNavigate();

	useEffect(() => {
		if (!isEditing) return;

		const fetchProfile = async () => {
			try {
				const response = await fetchWithAuth(`${BASE_URL}/api/profile/general/`);

				if (response.ok) {
					const data = await response.json().catch(() => ({}));
					console.log("Отримані дані профілю:", data);

					// Форматування телефону
					let formattedPhone = data.phone_number;
					if (typeof formattedPhone === 'string') {
						const m = formattedPhone.match(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/);
						if (m) {
							formattedPhone = `+38(${m[1]})-${m[2]}-${m[3]}-${m[4]}`;
						}
					}

					const selectedCity = CityOptions.find(opt => opt.value === data.city) ||
						(data.city ? { value: data.city, label: data.city } : null);
					const selectedCountry = COUNTRY_OPTIONS.find(opt => opt.value === data.country) || null;
					const selectedGender = GENDER_OPTIONS.find(opt => opt.value === data.gender) || null;

					// 2. Оновлюємо стейт
					setFormState(prevState => ({
						...prevState,

						first_name: { value: data.first_name, realValue: data.first_name, isValid: true },
						last_name: { value: data.last_name, realValue: data.last_name, isValid: true },

						country: {
							value: selectedCountry?.label || "",
							realValue: selectedCountry,
							isValid: !!selectedCountry
						},
						city: {
							value: selectedCity?.label || "",
							realValue: selectedCity,
							isValid: !!selectedCity
						},
						gender: {
							value: selectedGender?.label || "",
							realValue: selectedGender,
							isValid: !!selectedGender
						},

						birthdate: { value: data.birthdate, realValue: data.birthdate, isValid: true },
						phone_number: { value: formattedPhone, realValue: formattedPhone, isValid: true },
						email: { value: data.email, realValue: data.email, isValid: true },
					}));

					console.log("Профіль завантажено:", data);
				}
			} catch (error) {
				console.error("Помилка завантаження профілю:", error);
			}
		};

		fetchProfile();

	}, [isEditing]);

	const isFormValid = (formState) => {
		const fieldsToCheck = isEditing
			? REQUIRED_FIELDS.filter(field => field !== "password" && field !== "repeat_password")
			: REQUIRED_FIELDS;

		for (const field of fieldsToCheck) {
			if (!formState[field] || !formState[field].realValue) return false;

			if (formState[field].isValid === false) return false;
		}

		return true;
	}

	const handleRegister = async (payload) => {
		setIsSubmitting(true);
		setSubmitError("");

		try {
			const response = await fetch(`${BASE_URL}/api/register/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				// Backend now sends a magic link to email and returns {detail}, no JWT.
				// Switch the page to a "check your inbox" state.
				const submittedEmail = payload.email || formState.email?.realValue || '';
				setPendingVerification({ email: submittedEmail });

			} else {
				const errorData = await response.json().catch(() => ({}));
				setSubmitError(errorData.detail || t("step1.error_register_failed"));
				console.error("Помилка реєстрації:", errorData);

				setFormState(prevState => {
					// Робимо копію поточного стейту
					const newState = { ...prevState };

					Object.keys(errorData).forEach(fieldName => {
						if (newState[fieldName]) {
							newState[fieldName] = {
								...newState[fieldName],
								isValid: false,
								errorText: Array.isArray(errorData[fieldName])
									? errorData[fieldName][0]
									: errorData[fieldName]
							};
						}
					});

					if (errorData.non_field_errors) {
						alert(errorData.non_field_errors[0]);
					}

					console.log(formState.email);
					return newState;
				});
			}
		} catch (error) {
			setSubmitError(t("step1.error_network"));
			console.error("Network error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdate = async (payload) => {
		setIsSubmitting(true);
		setSubmitError("");

		try {
			const { email, password, repeat_password, ...safeUpdatePayload } = payload;

			const response = await fetchWithAuth(`${BASE_URL}/api/profile/general/`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(safeUpdatePayload),
			});

			if (response.ok) {
				navigate('/profile/personal');
			} else {
				const errorData = await response.json().catch(() => ({}));
				setSubmitError(errorData.detail || t("step1.error_update_failed"));
				console.error("Помилка оновлення:", errorData);
			}
		} catch (error) {
			setSubmitError(t("step1.error_network"));
			console.error("Network error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmitClick = () => {
		const payload = buildRegistrationPayload(formState);

		if (isEditing) {
			handleUpdate(payload);
		} else {
			handleRegister(payload);
		}
	};

	const handleRetrieve = (res) => {
		const cityName = res.features?.[0]?.properties?.name;

	};

	const handlePasswordReset = async () => {
	    const email = formState.email?.realValue;
	    if (!email) return;

	    try {
	        await fetch(`${BASE_URL}/api/reset-password/request/`, {
	            method: 'POST',
	            headers: { 'Content-Type': 'application/json' },
	            body: JSON.stringify({ email }),
	        });
	        alert(`Лист з посиланням надіслано на ${email}`);
	    } catch {
	        alert('Помилка. Спробуйте ще раз.');
	    }
	};

	const handleResend = async () => {
		const target = pendingVerification?.email;
		if (!target) return;
		setIsResending(true);
		setResendStatus({ kind: null, text: '' });
		try {
			const res = await fetch(`${BASE_URL}/api/resend-link/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: target }),
			});
			const body = await res.json().catch(() => ({}));
			if (res.ok) {
				setResendStatus({ kind: 'ok', text: body.detail || t("step1.resend_success", { email: target }) });
			} else if (res.status === 429) {
				setResendStatus({ kind: 'error', text: body.detail || t("step1.error_too_many_attempts") });
			} else {
				setResendStatus({ kind: 'error', text: body.detail || t("step1.error_send_failed") });
			}
		} catch {
			setResendStatus({ kind: 'error', text: t("step1.error_network_retry") });
		} finally {
			setIsResending(false);
		}
	};

	if (pendingVerification && !isEditing) {
		return (
			<div className="landing-page">
				<Header />
				<div style={{ padding: "60px 20px" }}>
					<div className="form-card" style={{ maxWidth: 560, gap: 16, textAlign: 'center' }}>
						<div style={{ fontSize: 48 }}>📬</div>
						<h2 style={{ fontFamily: 'Seenonim, Inter, sans-serif', fontSize: 28, margin: 0 }}>
							{t('step1.check_email')}
						</h2>
						<p style={{ color: '#555', fontSize: 16, margin: 0, fontFamily: 'Inter' }}>
							{t('step1.email_sent_to')}{' '}
							<strong>{pendingVerification.email}</strong>.
							{t('step1.click_link')}
						</p>
						{resendStatus.text && (
							<p style={{
								fontSize: 14, fontFamily: 'Inter', margin: 0,
								color: resendStatus.kind === 'ok' ? '#2e7d32' : '#c62828',
							}}>
								{resendStatus.text}
							</p>
						)}
						<div style={{ width: '100%' }}>
							<SubmitBtn
								onClick={handleResend}
								disabled={isResending}
								btntext={isResending ? t('step1.resending') : t('step1.resend_btn')}
							/>
						</div>
						<button
							type="button"
							onClick={() => navigate('/')}
							style={{
								background: 'none', border: 'none', padding: 0,
								color: '#555', fontFamily: 'Inter', fontSize: 14,
								cursor: 'pointer', textDecoration: 'underline',
							}}
						>
							{t('step1.back_to_home')}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="landing-page">
			<Header />

			<div style={{ padding: "40px 20px 40px 20px" }}>
				{/* CARD */}
				<div className="form-card">

					{isEditing && (
						<div style={{
							display: "flex",
							gap: "15px",
							marginBottom: "40px",
							width: "100%",
							justifyContent: "center",
							flexWrap: "wrap"
						}}>
							<NavStep isActive>{t('step1.nav_basic')}</NavStep>
							<NavStep onClick={() => navigate('/profile/personal')}>{t('step2.nav_personal')}</NavStep>
							<NavStep onClick={() => navigate('/profile/housing')}>{t('step3.nav_housing')}</NavStep>
						</div>
					)}

					{/* FORM GRID */}
					<div className='main-grid responsive-form-grid'>

						<div>
							<RequiredLabel>{t('step1.first_name')}</RequiredLabel>
							<SmartBox
								fieldName="first_name"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartInput name="first_name" placeholder={t('step1.first_name_placeholder')} />
							</SmartBox>
						</div>

						<div>
							<RequiredLabel>{t('step1.last_name')}</RequiredLabel>
							<SmartBox
								fieldName="last_name"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartInput name="last_name" placeholder={t('step1.last_name_placeholder')} />
							</SmartBox>
						</div>

						<div>
							<RequiredLabel>{t('step1.country')}</RequiredLabel>
							<SmartBox
								fieldName="country"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartSelect
									options={COUNTRY_OPTIONS}
									placeholder={t('step1.country')}
									name="country"
								/>
							</SmartBox>
						</div>

						<div>
							<RequiredLabel>{t('step1.city')}</RequiredLabel>
							<SmartBox
								fieldName="city"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<CitySelector />
							</SmartBox>
						</div>

						<div>
							<RequiredLabel>{t('step1.gender')}</RequiredLabel>
							<SmartBox
								fieldName="gender"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartSelect
									options={GENDER_OPTIONS}
									placeholder={t('step1.gender')}
									name="gender"
								/>
							</SmartBox>
						</div>

						<div style={{ position: "relative", zIndex: 1001 }}>
							<RequiredLabel>{t('step1.birthdate')}</RequiredLabel>
							<SmartBox
								fieldName="birthdate"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartCalendar />
							</SmartBox>
						</div>

						<div>
							<RequiredLabel>{t('step1.phone')}</RequiredLabel>
							<SmartBox
								fieldName="phone_number"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartInput
									placeholder="+38(0__)-___-__-__"
									mask="+38(099)-999-99-99"
									maskChar="_"
									inputMode="numeric"
									pattern="\+38\(0\d{2}\)-\d{3}-\d{2}-\d{2}"
									name="phone_number"
								/>
							</SmartBox>
						</div>

						<div>
							<RequiredLabel>{t('step1.email')}</RequiredLabel>
							<SmartBox
								fieldName="email"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartInput
									placeholder={t('step1.email')}
									name="email"
								/>
							</SmartBox>
						</div>

						{!isEditing && (
							<div style={{ position: 'relative', zIndex: 10 }}>
								<RequiredLabel>{t('step1.password')}</RequiredLabel>
								<SmartBox
									fieldName="password"
									formState={formState}
									setFormState={setFormState}
									mywidth="100%"
								>
									<PasswordInput name="password" />
								</SmartBox>
							</div>

						)}

						{!isEditing && (
							<div>
								<RequiredLabel>{t('step1.repeat_password')}</RequiredLabel>
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
						)}

					</div>

					{isEditing && (
						<div className="change-password-link">
							<a onClick={handlePasswordReset} style={{ cursor: 'pointer' }}>
								{t('step1.change_password')}
							</a>
						</div>
					)}

					{/*SUBMIT BUTTON*/}
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignContent: "center",
							marginTop: "36px"
						}}
					>
						<SubmitBtn
							onClick={onSubmitClick}
							disabled={!isFormValid(formState)}
							btntext={isEditing ? t('step1.next') : t('step1.register_btn')}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}


function RequiredLabel({ children }) {
	return (
		<div className="form-label">
			{children}
			<span style={requiredAsteriskStyle}> *</span>
		</div>
	);
}

const requiredAsteriskStyle = {
	color: "#ff3333",
};

