import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { SmartSelect } from '../components/SmartSelect.jsx';
import { SmartText } from '../components/SmartText.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';
import { UploadPhoto } from '../components/UploadPhoto.jsx';
import { MultiSelect } from '../components/MultiSelect.jsx';
import { languageOptions } from '../components/languageOptions.jsx';
import { statusOptions } from '../components/statusOptions.jsx';
import { orbitOptions } from '../components/orbitOptions.jsx';
import { smokingOptions } from '../components/smokingOptions.jsx';
import { partyingOptions } from '../components/partyingOptions.jsx';
import { hobbyOptions } from '../components/hobbyOptions.jsx';
import { NavStep } from '../components/NavStep.jsx';

import { fetchWithAuth } from '../utils/api.js';

function buildRegistrationPayload(formState) {
	const result = {};
	Object.keys(formState).forEach((key) => {
		// hobbies is a hybrid: split tags into preset ints + custom strings.
		if (key === 'hobbies') {
			const tags = Array.isArray(formState.hobbies?.realValue)
				? formState.hobbies.realValue
				: [];
			const presetIds = [];
			const customNames = [];
			for (const tag of tags) {
				if (!tag) continue;
				const v = tag.value !== undefined ? tag.value : tag;
				if (typeof v === 'number') {
					presetIds.push(v);
				} else if (typeof v === 'string') {
					const name = v.trim();
					if (name) customNames.push(name);
				}
			}
			result.hobbies = presetIds;
			result.custom_hobbies = customNames;
			return;
		}
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
	"status", "orbit",
	"languages",
	"political_coordinate_economic", "political_coordinate_social",
	"cleanliness",
	"my_vibe", "buddy_vibe",
	"schedule", "sleep_schedule",
	"smoking", "partying",
	"extra_intro_version",
	"hobbies",
];

function CharCounter({ value, min, max }) {
	const { t } = useTranslation();
	const len = value ? value.length : 0;
	const tooShort = len > 0 && len < min;
	const tooLong = len > max;
	const color = tooShort || tooLong ? '#ff3333' : '#666';
	return (
		<div style={{ fontSize: '12px', fontFamily: 'Inter', color, marginTop: '2px', textAlign: 'right' }}>
			{len} / {max} ({t('step2.min')} {min})
		</div>
	);
}

export default function Step2() {
	const { t } = useTranslation();
	const [formState, setFormState] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [photoCount, setPhotoCount] = useState(0);
	const BASE_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetchWithAuth(`${BASE_URL}/api/profile/personal/`);

				if (response.ok) {
					const data = await response.json().catch(() => ({}));

					const selectedStatus = statusOptions.find(o => o.value === data.status) || null;
					const selectedOrbit = orbitOptions.find(o => o.value === data.orbit) || null;
					const selectedSmoking = smokingOptions.find(o => o.value === data.smoking) || null;
					const selectedPartying = partyingOptions.find(o => o.value === data.partying) || null;
					const selectedLanguages = data.languages
						? languageOptions.filter(o => data.languages.includes(o.value))
						: [];
					const presetTags = data.hobbies
						? hobbyOptions.filter(o => data.hobbies.includes(o.value))
						: [];
					const customTags = Array.isArray(data.custom_hobbies)
						? data.custom_hobbies.map(name => ({ value: name, label: name }))
						: [];
					const selectedHobbies = [...presetTags, ...customTags];

					setFormState(prev => ({
						...prev,
						status: { value: selectedStatus, realValue: selectedStatus, isValid: !!selectedStatus },
						orbit: { value: selectedOrbit, realValue: selectedOrbit, isValid: !!selectedOrbit },
						languages: { value: selectedLanguages, realValue: selectedLanguages, isValid: selectedLanguages.length > 0 },
						political_coordinate_economic: { value: data.political_coordinate_economic, realValue: data.political_coordinate_economic, isValid: data.political_coordinate_economic !== null && data.political_coordinate_economic !== undefined },
						political_coordinate_social: { value: data.political_coordinate_social, realValue: data.political_coordinate_social, isValid: data.political_coordinate_social !== null && data.political_coordinate_social !== undefined },
						cleanliness: { value: data.cleanliness, realValue: data.cleanliness, isValid: !!data.cleanliness },
						my_vibe: { value: data.my_vibe || "", realValue: data.my_vibe || "", isValid: !!data.my_vibe && data.my_vibe.length >= 200 && data.my_vibe.length <= 600 },
						buddy_vibe: { value: data.buddy_vibe || "", realValue: data.buddy_vibe || "", isValid: !!data.buddy_vibe && data.buddy_vibe.length >= 200 && data.buddy_vibe.length <= 600 },
						schedule: { value: data.schedule || "", realValue: data.schedule || "", isValid: !!data.schedule && data.schedule.length >= 3 && data.schedule.length <= 100 },
						sleep_schedule: { value: data.sleep_schedule || "", realValue: data.sleep_schedule || "", isValid: !!data.sleep_schedule && data.sleep_schedule.length >= 3 && data.sleep_schedule.length <= 100 },
						smoking: { value: selectedSmoking, realValue: selectedSmoking, isValid: !!selectedSmoking },
						partying: { value: selectedPartying, realValue: selectedPartying, isValid: !!selectedPartying },
						extra_intro_version: { value: data.extra_intro_version, realValue: data.extra_intro_version, isValid: data.extra_intro_version !== null && data.extra_intro_version !== undefined },
						hobbies: { value: selectedHobbies, realValue: selectedHobbies, isValid: selectedHobbies.length > 0 },
					}));
				}
			} catch (error) {
				console.error("Помилка завантаження профілю:", error);
			}
		};

		fetchProfile();
	}, []);

	const isFormValid = (formState) => {
		if (photoCount < 1) return false;
		for (const field of REQUIRED_FIELDS) {
			const fd = formState[field];
			if (!fd) return false;
			if (fd.realValue === undefined || fd.realValue === null || fd.realValue === "") return false;
			if (Array.isArray(fd.realValue) && fd.realValue.length === 0) return false;
			if (fd.isValid === false) return false;
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
				navigate('/profile/housing');
			} else {
				const errorData = await response.json().catch(() => ({}));
				setSubmitError(errorData.detail || t("step2.error_save_failed"));
				console.error("Помилка збереження:", errorData);
			}
		} catch (error) {
			setSubmitError(t("step2.error_network"));
			console.error("Network error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmitClick = () => {
		const payload = buildRegistrationPayload(formState);
		handleSave(payload);
	};

	const setSliderField = (fieldName, value) => {
		setFormState(prev => ({
			...prev,
			[fieldName]: { realValue: value, value: value, isValid: true }
		}));
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
						<NavStep isActive>{t('step2.nav_personal')}</NavStep>
						<NavStep onClick={() => navigate('/profile/housing')}>{t('step3.nav_housing')}</NavStep>
					</div>

					{/* PHOTO */}
					<div className="form-label" style={{ alignSelf: "flex-start" }}>{t('step2.profile_photo')}</div>
					<div style={{
						position: "relative",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						marginBottom: "30px"
					}}>
						<UploadPhoto onChange={(saved) => setPhotoCount(saved.length)} />
					</div>

					<div className='main-grid responsive-form-grid'>

						{/* STATUS */}
						<div>
							<div className="form-label">{t('step2.status')}</div>
							<SmartBox mywidth="100%" fieldName="status" formState={formState} setFormState={setFormState}>
								<SmartSelect name="status" placeholder={t('step2.status_placeholder')} options={statusOptions} />
							</SmartBox>
						</div>

						{/* ORBIT */}
						<div>
							<div className="form-label">{t('step2.orbit')}</div>
							<SmartBox mywidth="100%" fieldName="orbit" formState={formState} setFormState={setFormState}>
								<SmartSelect name="orbit" placeholder={t('step2.orbit_placeholder')} options={orbitOptions} />
							</SmartBox>
						</div>

						{/* LANGUAGES */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label" style={{ marginBottom: "0px" }}>{t('step2.languages')}</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								{t('step2.languages_desc')}
							</div>
							<SmartBox mywidth="100%" fieldName="languages" formState={formState} setFormState={setFormState}>
								<MultiSelect name="languages" options={languageOptions} placeholder={t('step2.languages_placeholder')} />
							</SmartBox>
						</div>

						{/* POLITICAL COORDINATES */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step2.political')}</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								<p>{t('step2.political_desc')}
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
								value={String(formState.political_coordinate_economic?.realValue ?? '0')}
								min='-100'
								max='100'
								onChange={(e) => setSliderField("political_coordinate_economic", e.target.value)}
								list='markers'
							/>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px" }}>
								<span>{t('step2.left')}</span>
								<span style={{ marginLeft: "16px", fontSize: "21px", pointerEvents: "none" }}>·</span>
								<span>{t('step2.right')}</span>
							</div>
						</div>

						<div style={{ marginTop: "-20px" }}>
							<input
								className='slider'
								type='range'
								value={String(formState.political_coordinate_social?.realValue ?? '0')}
								min='-100'
								max='100'
								onChange={(e) => setSliderField("political_coordinate_social", e.target.value)}
							/>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px" }}>
								<span>{t('step2.liberal')}</span>
								<span style={{ marginLeft: "11px", fontSize: "21px", pointerEvents: "none" }}>·</span>
								<span>{t('step2.communitarian')}</span>
							</div>
						</div>

						{/* CLEANLINESS */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step2.cleanliness')}</div>
							<input
								className='slider'
								type='range'
								value={String(formState.cleanliness?.realValue ?? '3')}
								min='1'
								max='5'
								step='1'
								onChange={(e) => setSliderField("cleanliness", e.target.value)}
							/>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px" }}>
								<span>{t('step2.messy')}</span>
								<span>{t('step2.neat')}</span>
							</div>
						</div>

						{/* MY VIBE */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step2.my_vibe')}</div>
							<SmartBox mywidth="100%" fieldName="my_vibe" formState={formState} setFormState={setFormState}>
								<SmartText name="my_vibe" placeholder={t('step2.my_vibe_placeholder')} />
							</SmartBox>
							<CharCounter value={formState.my_vibe?.realValue} min={200} max={600} />
						</div>

						{/* BUDDY VIBE */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step2.buddy_vibe')}</div>
							<SmartBox mywidth="100%" fieldName="buddy_vibe" formState={formState} setFormState={setFormState}>
								<SmartText name="buddy_vibe" placeholder={t('step2.buddy_vibe_placeholder')} />
							</SmartBox>
							<CharCounter value={formState.buddy_vibe?.realValue} min={200} max={600} />
						</div>

						{/* SCHEDULE */}
						<div>
							<div className="form-label">{t('step2.schedule')}</div>
							<SmartBox mywidth="100%" fieldName="schedule" formState={formState} setFormState={setFormState}>
								<SmartText name="schedule" placeholder={t('step2.schedule_placeholder')} />
							</SmartBox>
							<CharCounter value={formState.schedule?.realValue} min={3} max={100} />
						</div>

						{/* SLEEP SCHEDULE */}
						<div>
							<div className="form-label">{t('step2.sleep_schedule')}</div>
							<SmartBox mywidth="100%" fieldName="sleep_schedule" formState={formState} setFormState={setFormState}>
								<SmartText name="sleep_schedule" placeholder={t('step2.sleep_schedule_placeholder')} />
							</SmartBox>
							<CharCounter value={formState.sleep_schedule?.realValue} min={3} max={100} />
						</div>

						{/* SMOKING */}
						<div>
							<div className="form-label">{t('step2.smoking')}</div>
							<SmartBox mywidth="100%" fieldName="smoking" formState={formState} setFormState={setFormState}>
								<SmartSelect name="smoking" placeholder={t('step2.smoking_placeholder')} options={smokingOptions} />
							</SmartBox>
						</div>

						{/* PARTYING */}
						<div>
							<div className="form-label">{t('step2.partying')}</div>
							<SmartBox mywidth="100%" fieldName="partying" formState={formState} setFormState={setFormState}>
								<SmartSelect name="partying" placeholder={t('step2.partying_placeholder')} options={partyingOptions} />
							</SmartBox>
						</div>

						{/* INTRO-/EXTROVERT */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label">{t('step2.intro_extro')}</div>
							<input
								className='slider'
								type='range'
								value={String(formState.extra_intro_version?.realValue ?? '0')}
								min='-1'
								max='1'
								step='1'
								onChange={(e) => setSliderField("extra_intro_version", e.target.value)}
							/>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", fontFamily: "Inter", color: "#000" }}>
								<span>{t('step2.introvert')}</span>
								<span style={{ marginLeft: '12px' }}>{t('step2.ambivert')}</span>
								<span>{t('step2.extrovert')}</span>
							</div>
						</div>

						{/* HOBBIES */}
						<div style={{ gridColumn: "1 / -1" }}>
							<div className="form-label" style={{ marginBottom: "0px" }}>{t('step2.hobbies')}</div>
							<div style={{ fontSize: "12px", fontFamily: "Inter", color: "#000", marginTop: "-4px", marginBottom: "6px" }}>
								{t('step2.hobbies_desc')}
							</div>
							<SmartBox mywidth="100%" fieldName="hobbies" formState={formState} setFormState={setFormState}>
								<MultiSelect
									name="hobbies"
									options={hobbyOptions}
									placeholder={t('step2.hobbies_placeholder')}
									formatCreateLabel={(input) => t('step2.add_custom_hobby', { input })}
									isValidNewOption={(input) => {
										const trimmed = (input || '').trim();
										return trimmed.length > 0 && trimmed.length <= 50;
									}}
								/>
							</SmartBox>
						</div>
					</div>

					{submitError && (
						<div style={{ color: "red", marginTop: "16px", fontFamily: "Inter" }}>{submitError}</div>
					)}

					<div style={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center", marginTop: "36px" }}>
						<SubmitBtn
							onClick={onSubmitClick}
							disabled={!isFormValid(formState) || isSubmitting}
							btntext={t('step2.save_btn')}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

