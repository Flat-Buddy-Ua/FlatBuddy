import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SmartSelect } from '../components/SmartSelect.jsx';
import { SmartInput } from '../components/SmartInput.jsx';
import { SmartText } from '../components/SmartText.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import { SmartCreatable } from '../components/SmartCreatable.jsx';
import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';
import { UploadPhoto } from '../components/UploadPhoto.jsx';
import { UniversityOptions } from '../components/UniversityOptions.jsx';
import { MultiSelect } from '../components/MultiSelect.jsx';
import { languageOptions } from '../components/languageOptions.jsx';
import { MBTI } from '../components/MBTI.jsx';

import { fetchWithAuth } from '../utils/api.js';

function buildRegistrationPayload(formState) {
	const result = {};
	Object.keys(formState).forEach((key) => {
		let value = formState[key].realValue;
		if (Array.isArray(value)) {
			value = value.map(item => (item && item.value !== undefined ? item.value : item));
		} else if (value && typeof value === 'object' && value.value !== undefined) {
			value = value.value;
		}
		result[key] = value;
	});
	return result;
}

const REQUIRED_FIELDS = [
	"university", "specialization",
	"study_year", "languages",
	"political_coordinate_economic", "political_coordinate_social",
	"cleanliness", "schedule",
	"lifestyle", "sleep_schedule",
	"bad_habits", "mbti",
	"extra_intro_version",
	"hobbies", "bio",
	"looking_for",
	"photo"
];

export default function Step2() {
	const [formState, setFormState] = React.useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const BASE_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetchWithAuth(`${BASE_URL}/api/profile/personal/`);

				if (response.ok) {
					const data = await response.json();
					console.log("Отримані дані профілю:", data);

					const selectedMbti = MBTI.find(opt => opt.value === data.mbti) || null;
					const selectedLanguages = data.languages
						? languageOptions.filter(opt => data.languages.includes(opt.value))
						: [];
					const selectedUniversity = data.university
						? (UniversityOptions.find(opt => opt.value === data.university) || { value: data.university, label: data.university })
						: null;

					setFormState(prevState => ({
						...prevState,
						university: { value: selectedUniversity?.label || "", realValue: selectedUniversity, isValid: !!selectedUniversity },
						specialization: { value: data.specialization || "", realValue: data.specialization, isValid: true },
						study_year: { value: data.study_year || "", realValue: data.study_year, isValid: true },
						languages: { value: selectedLanguages, realValue: selectedLanguages, isValid: selectedLanguages.length > 0 },
						political_coordinate_economic: { value: data.political_coordinate_economic, realValue: data.political_coordinate_economic, isValid: true },
						political_coordinate_social: { value: data.political_coordinate_social, realValue: data.political_coordinate_social, isValid: true },
						cleanliness: { value: data.cleanliness || "", realValue: data.cleanliness, isValid: true },
						schedule: { value: data.schedule || "", realValue: data.schedule, isValid: true },
						lifestyle: { value: data.lifestyle || "", realValue: data.lifestyle, isValid: true },
						sleep_schedule: { value: data.sleep_schedule || "", realValue: data.sleep_schedule, isValid: true },
						bad_habits: { value: data.bad_habits || "", realValue: data.bad_habits, isValid: true },
						mbti: { value: selectedMbti?.label || "", realValue: selectedMbti, isValid: !!selectedMbti },
						extra_intro_version: { value: data.extra_intro_version, realValue: data.extra_intro_version, isValid: true },
						hobbies: { value: data.hobbies || "", realValue: data.hobbies, isValid: true },
						bio: { value: data.bio || "", realValue: data.bio, isValid: true },
						looking_for: { value: data.looking_for || "", realValue: data.looking_for, isValid: true },
					}));

					console.log("Профіль завантажено:", data);
				}
			} catch (error) {
				console.error("Помилка завантаження профілю:", error);
			}
		};

		fetchProfile();
	}, []);

	const isFormValid = (formState) => {
		for (const field of REQUIRED_FIELDS) {
			if (!formState[field] || !formState[field].realValue) return false;
			if (formState[field].isValid === false) return false;
		}
		return true;
	};

	const handleSave = async (payload) => {
		setIsSubmitting(true);
		setSubmitError("");

		try {
			const response = await fetchWithAuth(`${BASE_URL}/api/profile/personal/`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				alert("Дані успішно оновлено!");
			} else {
				const errorData = await response.json().catch(() => ({}));
				setSubmitError(errorData.detail || "Не вдалося зберегти дані.");
				console.error("Помилка збереження:", errorData);
			}
		} catch (error) {
			setSubmitError("Помилка мережі. Спробуйте пізніше.");
			console.error("Network error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmitClick = () => {
		const payload = buildRegistrationPayload(formState);
		handleSave(payload);
	};

	const handleLinkClick = (url) => {
		window.open(url, '_blank');
	};

	const setSliderField = (fieldName, value) => {
		setFormState(prev => ({
			...prev,
			[fieldName]: { realValue: value, value: value, isValid: true }
		}));
	};

	const navStepStyle = (isActive, isDisabled = false) => ({
		padding: "10px 20px",
		border: isActive ? "2px solid #111" : "2px solid #F6DDD4",
		backgroundColor: isActive ? "#FCD531" : isDisabled ? "#F7F1EE" : "transparent",
		color: isDisabled ? "#8A817C" : "#111",
		fontFamily: "'Seenonim', 'Inter', sans-serif",
		fontSize: "16px",
		cursor: isActive ? "default" : isDisabled ? "not-allowed" : "pointer",
		transition: "all 0.2s ease",
		transform: isActive ? "translate(-2px, -2px)" : "none",
		boxShadow: isActive ? "4px 4px 0px #111" : "none",
		opacity: isDisabled ? 0.7 : 1,
		pointerEvents: isDisabled ? "none" : "auto",
	});

	const formCardStyle = {
		width: "100%",
		maxWidth: 800,
		border: "3px solid #F6DDD4",
		padding: "clamp(24px, 6vw, 80px)",
		margin: "auto",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		boxSizing: "border-box",
		overflowX: "hidden",
	};

	return (
		<div className="landing-page">
			<Header />

			<div style={{ padding: "40px 20px 40px 20px" }}>
				{/* CARD */}
				<div style={formCardStyle}>

					<div style={{
						display: "flex",
						gap: "15px",
						marginBottom: "40px",
						width: "100%",
						justifyContent: "center",
						flexWrap: "wrap"
					}}>
						<div style={navStepStyle(false)} onClick={() => navigate('/profile/details')}>1. Базові дані</div>
						<div style={navStepStyle(true)}>2. Про мене</div>
						<div style={navStepStyle(false)} onClick={() => navigate('/profile/housing')}>3. Проживання</div>
					</div>

					{/* PHOTO */}
					<div style={{ ...labelStyle, alignSelf: "flex-start" }}>Фотографія профілю</div>
					<div style={{
						position: "relative",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						marginBottom: "30px"
					}}>
						<UploadPhoto
							onChange={(file) => setFormState(prev => ({
								...prev,
								photo: { realValue: file, value: file, isValid: !!file }
							}))}
						/>
					</div>

					{/* FORM GRID */}
					<div className='main-grid'>

						{/* UNIVER */}
						<div>
							<div style={labelStyle}>Заклад освіти</div>
							<SmartBox fieldName="university" formState={formState} setFormState={setFormState}>
								<SmartCreatable
									name="university"
									placeholder="Оберіть або введіть свій університет"
									options={UniversityOptions}
								/>
							</SmartBox>
						</div>

						{/* FACULTY */}
						<div>
							<div style={labelStyle}>Спеціалізація</div>
							<SmartBox fieldName="specialization" formState={formState} setFormState={setFormState}>
								<SmartInput name="specialization" placeholder="Наприклад, Комп'ютерні науки" />
							</SmartBox>
						</div>

						{/* COURSE */}
						<div>
							<div style={{ ...labelStyle, marginBottom: "8px", marginTop: "14px" }}>Курс</div>
							<SmartBox fieldName="study_year" formState={formState} setFormState={setFormState}>
								<SmartInput name="study_year" placeholder="Наприклад, 2-й курс" />
							</SmartBox>
						</div>

						{/* LANGUAGES */}
						<div>
							<div style={{ ...labelStyle, marginBottom: "0px" }}>Мови</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								Допустимі мови спілкування
							</div>
							<SmartBox fieldName="languages" formState={formState} setFormState={setFormState}>
								<MultiSelect name="languages" options={languageOptions} placeholder="Оберіть мови" />
							</SmartBox>
						</div>

						{/* POLITICAL COORDINATES */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Політична координата</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								<p>Якщо ви не знаєте своєї політичної координати, пройдіть тест за посиланням
									<br />
									<a href="https://www.idrlabs.com/political-coordinates/test.php">
										https://www.idrlabs.com/political-coordinates/test.php
									</a>
								</p>
							</div>
						</div>

						<div style={{ marginTop: "-20px" }}>
							<input
								className='slider'
								type='range'
								defaultValue={formState.political_coordinate_economic?.value ?? '0'}
								min='-100'
								max='100'
								onChange={(e) => setSliderField("political_coordinate_economic", e.target.value)}
								list='markers'
							/>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px" }}>
								<span>Лівий</span>
								<span style={{ marginLeft: "16px", fontSize: "21px", pointerEvents: "none" }}>·</span>
								<span>Правий</span>
							</div>
						</div>

						<div style={{ marginTop: "-20px" }}>
							<input
								className='slider'
								type='range'
								defaultValue={formState.political_coordinate_social?.value ?? '0'}
								min='-100'
								max='100'
								onChange={(e) => setSliderField("political_coordinate_social", e.target.value)}
							/>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px" }}>
								<span>Ліберальний</span>
								<span style={{ marginLeft: "11px", fontSize: "21px", pointerEvents: "none" }}>·</span>
								<span>Комунітарний</span>
							</div>
						</div>

						{/* CLEANLINESS */}
						<div>
							<div style={labelStyle}>Охайність</div>
							<SmartBox fieldName="cleanliness" formState={formState} setFormState={setFormState}>
								<SmartInput
									name="cleanliness"
									placeholder="Ваша охайність від 1 до 5"
									inputGuard={(value) => {
										if (value === "") return "";
										if (/^[1-5]$/.test(value)) return value;
										return undefined;
									}}
								/>
							</SmartBox>
						</div>

						{/* SCHEDULE */}
						<div>
							<div style={labelStyle}>Розклад</div>
							<SmartBox fieldName="schedule" formState={formState} setFormState={setFormState}>
								<SmartText name="schedule" placeholder="Опишіть ваш розклад" />
							</SmartBox>
						</div>

						{/* LIFESTYLE */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Стиль життя</div>
							<SmartBox mywidth="650px" fieldName="lifestyle" formState={formState} setFormState={setFormState}>
								<SmartText name="lifestyle" placeholder="Опишіть ваш стиль життя" />
							</SmartBox>
						</div>

						{/* SLEEP SCHEDULE */}
						<div>
							<div style={labelStyle}>Графік сну</div>
							<SmartBox fieldName="sleep_schedule" formState={formState} setFormState={setFormState}>
								<SmartText name="sleep_schedule" placeholder="Опишіть ваш графік сну" />
							</SmartBox>
						</div>

						{/* BAD HABITS */}
						<div>
							<div style={labelStyle}>Шкідливі звички</div>
							<SmartBox fieldName="bad_habits" formState={formState} setFormState={setFormState}>
								<SmartText name="bad_habits" placeholder="Опишіть ваші шкідливі звички" />
							</SmartBox>
						</div>

						{/* MBTI */}
						<div>
							<div style={labelStyle}>MBTI</div>
							<SmartBox fieldName="mbti" formState={formState} setFormState={setFormState}>
								<SmartSelect name="mbti" placeholder="Оберіть ваш MBTI тип" options={MBTI} />
							</SmartBox>
							<div style={{ ...labelStyle, marginTop: "4px" }}>
								<span style={{ fontSize: "14px", fontFamily: "Inter", color: "#000", marginRight: "8px" }}>
									Якщо не знаєш свій тип:
								</span>
								<button
									className='mbti_btn'
									type='button'
									onClick={() => handleLinkClick('https://www.16personalities.com/uk/bezkoshtovnyy-test-na-vyznachennya-osobystosti')}
								>
									Тест MBTI
								</button>
							</div>
						</div>

						{/* INTRO-/EXTROVERT */}
						<div>
							<div style={labelStyle}>Інтроверт/екстраверт</div>
							<input
								className='slider'
								type='range'
								defaultValue={formState.extra_intro_version?.value ?? '0'}
								min='-1'
								max='1'
								step='1'
								onChange={(e) => setSliderField("extra_intro_version", e.target.value)}
							/>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", fontFamily: "Inter", color: "#000" }}>
								<span>Інтроверт</span>
								<span style={{ marginLeft: '12px' }}>Амбіверт</span>
								<span>Екстраверт</span>
							</div>
						</div>

						{/* HOBBY */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Захоплення/хобі</div>
							<SmartBox mywidth="650px" fieldName="hobbies" formState={formState} setFormState={setFormState}>
								<SmartText name="hobbies" placeholder="Розкажіть про свої захоплення та хобі" />
							</SmartBox>
						</div>

						{/* BIOGRAPHY */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Біографія</div>
							<SmartBox mywidth="650px" fieldName="bio" formState={formState} setFormState={setFormState}>
								<SmartText name="bio" placeholder="Біографія" />
							</SmartBox>
						</div>

						{/* LOOKING FOR */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Кого шукаєте</div>
							<SmartBox mywidth="650px" fieldName="looking_for" formState={formState} setFormState={setFormState}>
								<SmartText name="looking_for" placeholder="Опишіть вашого шуканого buddy" />
							</SmartBox>
						</div>
					</div>

					{submitError && (
						<div style={{ color: "red", marginTop: "16px", fontFamily: "Inter" }}>{submitError}</div>
					)}

					{/* SUBMIT BUTTON */}
					<div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center", marginTop: "36px" }}>
						<SubmitBtn
							onClick={onSubmitClick}
							disabled={!isFormValid(formState) || isSubmitting}
							btntext="Оновити"
						/>
					</div>
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
