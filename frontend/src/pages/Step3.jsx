import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SmartSelect } from '../components/SmartSelect.jsx';
import { SmartInput } from '../components/SmartInput.jsx';
import { SmartText } from '../components/SmartText.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';

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

const REQUIRED_FIELDS_BASE = [
	"room_sharing_preference",
	"preferred_gender",
	"housing_status",
	"budget",
	"preferred_districts",
	"planned_duration",
	"move_in_date",
	"has_pet",
];

export default function Step3() {
	const [formState, setFormState] = React.useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const BASE_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const REQUIRED_FIELDS = [
		...REQUIRED_FIELDS_BASE,
		...(formState.has_pet?.realValue === true ? ["pet_description"] : [])
	];

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetchWithAuth(`${BASE_URL}/api/profile/housing/`);

				if (response.ok) {
					const data = await response.json();
					console.log("Отримані дані профілю:", data);

					setFormState(prevState => ({
						...prevState,
						room_sharing_preference: { value: data.room_sharing_preference, realValue: data.room_sharing_preference, isValid: true },
						preferred_gender: { value: data.preferred_gender, realValue: data.preferred_gender, isValid: true },
						housing_status: { value: data.housing_status, realValue: data.housing_status, isValid: true },
						budget: { value: data.budget || "", realValue: data.budget, isValid: true },
						preferred_districts: { value: data.preferred_districts, realValue: data.preferred_districts, isValid: true },
						planned_duration: { value: data.planned_duration || "", realValue: data.planned_duration, isValid: true },
						move_in_date: { value: data.move_in_date || "", realValue: data.move_in_date, isValid: true },
						has_pet: { value: data.has_pet, realValue: data.has_pet, isValid: true },
						...(data.pet_description ? { pet_description: { value: data.pet_description, realValue: data.pet_description, isValid: true } } : {}),
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
			const response = await fetchWithAuth(`${BASE_URL}/api/profile/housing/`, {
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
						<div style={navStepStyle(false)} onClick={() => navigate('/profile/personal')}>2. Про мене</div>
						<div style={navStepStyle(true)}>3. Проживання</div>
					</div>

					{/* FORM GRID */}
					<div className='main-grid'>

						{/* PREFERENCES */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Оберіть свою преференцію</div>
							<SmartBox mywidth='650px' fieldName="room_sharing_preference" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={[
										{ value: 1, label: 'Мені комфортно ділити кімнату з співмешканцем' },
										{ value: 2, label: 'Я хочу мати окрему кімнату' },
									]}
									mywidth='630px'
									name="room_sharing_preference"
									placeholder="Чому ви надаєте перевагу?"
								/>
							</SmartBox>
						</div>

						{/* WHO TO LIVE WITH */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Із ким ви б хотіли проживати?</div>
							<SmartBox mywidth='650px' fieldName="preferred_gender" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={[
										{ value: 1, label: 'Лише з хлопцями' },
										{ value: 2, label: 'Лише з дівчатами' },
										{ value: 3, label: 'Не має значення' },
									]}
									mywidth='630px'
									name="preferred_gender"
									placeholder="Оберіть варіант"
								/>
							</SmartBox>
						</div>

						{/* HOUSING STATUS */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Що найкраще описує вашу ситуацію?</div>
							<SmartBox mywidth='650px' fieldName="housing_status" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={[
										{ value: 1, label: 'Я шукаю житло та співмешканця' },
										{ value: 2, label: 'Я шукаю лише співмешканця, маю своє/орендоване житло' },
									]}
									mywidth='630px'
									name="housing_status"
									placeholder="Оберіть варіант"
								/>
							</SmartBox>
						</div>

						{/* BUDGET */}
						<div>
							<div style={{ ...labelStyle, marginBottom: "8px", marginTop: "14px" }}>Який ваш бюджет?</div>
							<SmartBox fieldName="budget" formState={formState} setFormState={setFormState}>
								<SmartInput name="budget" placeholder="Вкажіть суму в грн" type="number" step="100" prefix="₴" />
							</SmartBox>
						</div>

						{/* DISTRICT */}
						<div>
							<div style={{ ...labelStyle, marginBottom: "0px" }}>Район/-и проживання</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								Оберіть бажаний район/райони проживання
							</div>
							<SmartBox fieldName="preferred_districts" formState={formState} setFormState={setFormState}>
								<SmartSelect
									isMulti
									options={[
										{ value: 0, label: 'Оберіть район/-и' }
									]}
									name="preferred_districts"
									placeholder="Оберіть район/-и"
								/>
							</SmartBox>
						</div>

						{/* TERM */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>На який термін плануєте проживання?</div>
							<SmartBox mywidth="650px" fieldName="planned_duration" formState={formState} setFormState={setFormState}>
								<SmartText name="planned_duration" placeholder="Ваш термін проживання" />
							</SmartBox>
						</div>

						{/* MOVE IN DATE */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Коли плануєте почати проживання?</div>
							<SmartBox mywidth="650px" fieldName="move_in_date" formState={formState} setFormState={setFormState}>
								<SmartText name="move_in_date" placeholder="Ваша дата початку проживання" />
							</SmartBox>
						</div>

						{/* PET */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div style={labelStyle}>Чи є у вас домашній улюбленець?</div>
							<SmartBox mywidth="650px" fieldName="has_pet" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={[
										{ value: true, label: 'Так, є' },
										{ value: false, label: 'Ні, нема' },
									]}
									mywidth='630px'
									name="has_pet"
									placeholder="Оберіть варіант"
								/>
							</SmartBox>
						</div>

						{/* PET DESCRIPTION */}
						{formState.has_pet?.realValue === true && (
							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Розкажіть про своїх улюбленців</div>
								<SmartBox mywidth="650px" fieldName="pet_description" formState={formState} setFormState={setFormState}>
									<SmartText name="pet_description" placeholder="Ваші улюбленці" />
								</SmartBox>
							</div>
						)}
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
