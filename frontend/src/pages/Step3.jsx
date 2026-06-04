import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import i18n from 'i18next';

import { SmartSelect } from '../components/SmartSelect.jsx';
import { SmartInput } from '../components/SmartInput.jsx';
import { SmartText } from '../components/SmartText.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import { SmartCalendar } from '../components/SmartCalendar.jsx';
import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';
import { CityOptions } from '../components/CityOptions.jsx';
import { districtsByCity } from '../components/districtsByCity.jsx';
import { plannedDurationOptions } from '../components/plannedDurationOptions.jsx';
import { NavStep } from '../components/NavStep.jsx';

import { fetchWithAuth } from '../utils/api.js';

function buildRegistrationPayload(formState) {
	const result = {};
	Object.keys(formState).forEach((key) => {
		let value = formState[key].realValue;
		if (Array.isArray(value)) {
			value = value.map(item => (item && item.value !== undefined ? item.value : item));
		} else if (value instanceof Date) {
			const y = value.getFullYear();
			const m = String(value.getMonth() + 1).padStart(2, '0');
			const d = String(value.getDate()).padStart(2, '0');
			value = `${y}-${m}-${d}`;
		} else if (value && typeof value === 'object' && value.value !== undefined) {
			value = value.value;
		}
		result[key] = value;
	});
	return result;
}

const ROOM_SHARING_OPTIONS = [
	{ value: 1, get label() { return i18n.t('step3.room_sharing_options.1'); } },
	{ value: 2, get label() { return i18n.t('step3.room_sharing_options.2'); } },
];

const PREFERRED_GENDER_OPTIONS = [
	{ value: 1, get label() { return i18n.t('step3.preferred_gender_options.1'); } },
	{ value: 2, get label() { return i18n.t('step3.preferred_gender_options.2'); } },
	{ value: 3, get label() { return i18n.t('step3.preferred_gender_options.3'); } },
];

const HOUSING_STATUS_OPTIONS = [
	{ value: 1, get label() { return i18n.t('step3.housing_status_options.1'); } },
	{ value: 2, get label() { return i18n.t('step3.housing_status_options.2'); } },
];

const HAS_PET_OPTIONS = [
	{ value: true, get label() { return i18n.t('step3.has_pet_options.true'); } },
	{ value: false, get label() { return i18n.t('step3.has_pet_options.false'); } },
];

const REQUIRED_FIELDS_BASE = [
	"room_sharing_preference",
	"preferred_gender",
	"housing_status",
	"budget_min",
	"budget_max",
	"destination",
	"preferred_districts",
	"planned_duration",
	"move_in_date",
	"has_pet",
];

function CharCounter({ value, min, max }) {
	const { t } = useTranslation();
	const len = value ? value.length : 0;
	const tooShort = len > 0 && len < min;
	const tooLong = len > max;
	const color = tooShort || tooLong ? '#ff3333' : '#666';
	return (
		<div style={{ fontSize: '12px', fontFamily: 'Inter', color, marginTop: '2px', textAlign: 'right' }}>
			{len} / {max} ({t('step3.min')} {min})
		</div>
	);
}

export default function Step3() {
	const { t } = useTranslation();
	const [formState, setFormState] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const BASE_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const REQUIRED_FIELDS = [
		...REQUIRED_FIELDS_BASE,
		...(formState.has_pet?.realValue?.value === true ? ["pet_description"] : []),
	];

	const destinationId = formState.destination?.realValue?.value;
	const moveInMinDate = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);
	const moveInMaxDate = useMemo(() => {
		const d = new Date();
		d.setFullYear(d.getFullYear() + 2);
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	const districtOptions = useMemo(() => {
		if (!destinationId) return [];
		return districtsByCity[destinationId] || [];
	}, [destinationId]);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetchWithAuth(`${BASE_URL}/api/profile/housing/`);

				if (response.ok) {
					const data = await response.json().catch(() => ({}));

					const selectedRoomSharing = ROOM_SHARING_OPTIONS.find(o => o.value === data.room_sharing_preference) || null;
					const selectedPreferredGender = PREFERRED_GENDER_OPTIONS.find(o => o.value === data.preferred_gender) || null;
					const selectedHousingStatus = HOUSING_STATUS_OPTIONS.find(o => o.value === data.housing_status) || null;
					const selectedDestination = CityOptions.find(o => o.value === data.destination) || null;
					const selectedPlannedDuration = plannedDurationOptions.find(o => o.value === data.planned_duration) || null;
					const selectedHasPet = data.has_pet !== undefined && data.has_pet !== null
						? HAS_PET_OPTIONS.find(o => o.value === data.has_pet) || null
						: null;

					const allDistricts = data.destination ? (districtsByCity[data.destination] || []) : [];
					const selectedDistricts = data.preferred_districts
						? allDistricts.filter(o => data.preferred_districts.includes(o.value))
						: [];

					setFormState(prev => ({
						...prev,
						room_sharing_preference: { value: selectedRoomSharing, realValue: selectedRoomSharing, isValid: !!selectedRoomSharing },
						preferred_gender: { value: selectedPreferredGender, realValue: selectedPreferredGender, isValid: !!selectedPreferredGender },
						housing_status: { value: selectedHousingStatus, realValue: selectedHousingStatus, isValid: !!selectedHousingStatus },
						budget_min: { value: data.budget_min ?? "", realValue: data.budget_min ?? "", isValid: data.budget_min != null },
						budget_max: { value: data.budget_max ?? "", realValue: data.budget_max ?? "", isValid: data.budget_max != null },
						destination: { value: selectedDestination, realValue: selectedDestination, isValid: !!selectedDestination },
						preferred_districts: { value: selectedDistricts, realValue: selectedDistricts, isValid: selectedDistricts.length > 0 },
						planned_duration: { value: selectedPlannedDuration, realValue: selectedPlannedDuration, isValid: !!selectedPlannedDuration },
						move_in_date: { value: data.move_in_date || "", realValue: data.move_in_date || "", isValid: !!data.move_in_date },
						has_pet: { value: selectedHasPet, realValue: selectedHasPet, isValid: !!selectedHasPet },
						...(data.pet_description
							? { pet_description: { value: data.pet_description, realValue: data.pet_description, isValid: data.pet_description.length >= 3 && data.pet_description.length <= 100 } }
							: {}),
					}));
				}
			} catch (error) {
				console.error("Помилка завантаження профілю:", error);
			}
		};

		fetchProfile();
	}, []);

	// When destination changes, drop districts that don't belong to the new city.
	useEffect(() => {
		if (!destinationId) return;
		setFormState(prev => {
			const current = prev.preferred_districts?.realValue;
			if (!Array.isArray(current) || current.length === 0) return prev;
			const allowed = new Set((districtsByCity[destinationId] || []).map(o => o.value));
			const filtered = current.filter(o => allowed.has(o.value));
			if (filtered.length === current.length) return prev;
			return {
				...prev,
				preferred_districts: { value: filtered, realValue: filtered, isValid: filtered.length > 0 },
			};
		});
	}, [destinationId]);

	const isFormValid = (formState) => {
		for (const field of REQUIRED_FIELDS) {
			const fd = formState[field];
			if (!fd) return false;
			if (fd.realValue === undefined || fd.realValue === null || fd.realValue === "") return false;
			if (Array.isArray(fd.realValue) && fd.realValue.length === 0) return false;
			if (fd.isValid === false) return false;
		}
		// budget_min must be <= budget_max if both numeric
		const minV = Number(formState.budget_min?.realValue);
		const maxV = Number(formState.budget_max?.realValue);
		if (minV && maxV && minV > maxV) return false;
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
				navigate('/');
			} else {
				const errorData = await response.json().catch(() => ({}));
				setSubmitError(errorData.detail || t("step3.error_save_failed"));
				console.error("Помилка збереження:", errorData);
			}
		} catch (error) {
			setSubmitError(t("step3.error_network"));
			console.error("Network error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmitClick = () => {
		const payload = buildRegistrationPayload(formState);
		handleSave(payload);
	};

	return (
		<div className="landing-page">
			<Header />

			<div style={{ padding: "40px 20px 40px 20px" }}>
				<div className="form-card">

					<div style={{
						display: "flex",
						gap: "15px",
						marginBottom: "40px",
						width: "100%",
						justifyContent: "center",
						flexWrap: "wrap"
					}}>
						<NavStep onClick={() => navigate('/profile/details')}>{t('step1.nav_basic')}</NavStep>
						<NavStep onClick={() => navigate('/profile/personal')}>{t('step2.nav_personal')}</NavStep>
						<NavStep isActive>{t('step3.nav_housing')}</NavStep>
					</div>

					<div className='main-grid responsive-form-grid'>

						{/* PREFERENCES */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step3.room_sharing')}</div>
							<SmartBox mywidth="100%" fieldName="room_sharing_preference" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={ROOM_SHARING_OPTIONS}
									name="room_sharing_preference"
									placeholder={t('step3.room_sharing_placeholder')}
								/>
							</SmartBox>
						</div>

						{/* WHO TO LIVE WITH */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step3.preferred_gender')}</div>
							<SmartBox mywidth="100%" fieldName="preferred_gender" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={PREFERRED_GENDER_OPTIONS}
									name="preferred_gender"
									placeholder={t('step3.preferred_gender_placeholder')}
								/>
							</SmartBox>
						</div>

						{/* HOUSING STATUS */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step3.housing_status')}</div>
							<SmartBox mywidth="100%" fieldName="housing_status" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={HOUSING_STATUS_OPTIONS}
									name="housing_status"
									placeholder={t('step3.housing_status_placeholder')}
								/>
							</SmartBox>
						</div>

						{/* BUDGET */}
						<div>
							<div className="form-label" style={{ marginBottom: "8px", marginTop: "14px" }}>{t('step3.budget_min')}</div>
							<SmartBox mywidth="100%" fieldName="budget_min" formState={formState} setFormState={setFormState}>
								<SmartInput name="budget_min" placeholder={t('step3.budget_min_placeholder')} type="number" step="100" prefix="₴" />
							</SmartBox>
						</div>

						<div>
							<div className="form-label" style={{ marginBottom: "8px", marginTop: "14px" }}>{t('step3.budget_max')}</div>
							<SmartBox mywidth="100%" fieldName="budget_max" formState={formState} setFormState={setFormState}>
								<SmartInput name="budget_max" placeholder={t('step3.budget_max_placeholder')} type="number" step="100" prefix="₴" />
							</SmartBox>
						</div>

						{/* DESTINATION CITY */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step3.destination')}</div>
							<SmartBox mywidth="100%" fieldName="destination" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={CityOptions}
									name="destination"
									placeholder={t('step3.destination_placeholder')}
								/>
							</SmartBox>
						</div>

						{/* DISTRICTS */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label" style={{ marginBottom: "0px" }}>{t('step3.preferred_districts')}</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								{destinationId
									? t('step3.districts_desc_selected')
									: t('step3.districts_desc_empty')}
							</div>
							<SmartBox mywidth="100%" fieldName="preferred_districts" formState={formState} setFormState={setFormState} disabled={!destinationId}>
								<SmartSelect
									isMulti
									options={districtOptions}
									name="preferred_districts"
									placeholder={destinationId ? t('step3.districts_placeholder') : t('step3.districts_placeholder_empty')}
									isDisabled={!destinationId}
									noOptionsMessage={() => destinationId ? t('step3.no_districts_message') : t('step3.districts_placeholder_empty')}
								/>
							</SmartBox>
						</div>

						{/* PLANNED DURATION */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step3.planned_duration')}</div>
							<SmartBox mywidth="100%" fieldName="planned_duration" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={plannedDurationOptions}
									name="planned_duration"
									placeholder={t('step3.planned_duration_placeholder')}
								/>
							</SmartBox>
						</div>

						{/* MOVE IN DATE */}
						<div style={{ gridColumn: "1 / -1", position: "relative", zIndex: 1001 }}>
							<div className="form-label">{t('step3.move_in_date')}</div>
							<SmartBox mywidth="100%" fieldName="move_in_date" formState={formState} setFormState={setFormState}>
								<SmartCalendar
									name="move_in_date"
									placeholder={t('step3.move_in_date_placeholder')}
									minDate={moveInMinDate}
									maxDate={moveInMaxDate}
								/>
							</SmartBox>
						</div>

						{/* PET */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step3.has_pet')}</div>
							<SmartBox mywidth="100%" fieldName="has_pet" formState={formState} setFormState={setFormState}>
								<SmartSelect
									options={HAS_PET_OPTIONS}
									name="has_pet"
									placeholder={t('step3.has_pet_placeholder')}
								/>
							</SmartBox>
						</div>

						{/* PET DESCRIPTION */}
						{formState.has_pet?.realValue?.value === true && (
							<div style={{ gridColumn: "1 / -1" }}>
								<div className="form-label">{t('step3.pet_description')}</div>
								<SmartBox mywidth="100%" fieldName="pet_description" formState={formState} setFormState={setFormState}>
									<SmartText name="pet_description" placeholder={t('step3.pet_description_placeholder')} />
								</SmartBox>
								<CharCounter value={formState.pet_description?.realValue} min={3} max={100} />
							</div>
						)}
					</div>

					{submitError && (
						<div style={{ color: "red", marginTop: "16px", fontFamily: "Inter" }}>{submitError}</div>
					)}

					<div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center", marginTop: "36px" }}>
						<SubmitBtn
							onClick={onSubmitClick}
							disabled={!isFormValid(formState) || isSubmitting}
							btntext={t('step3.save_btn')}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

