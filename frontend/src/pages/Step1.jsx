import React, { PureComponent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    { value: 1, label: "Чоловіча" },
    { value: 2, label: "Жіноча" },
    { value: 3, label: "Інша" },
];

export default function Step1 ({ isEditing }) {
	const [formState, setFormState] = React.useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const BASE_URL = import.meta.env.VITE_API_URL;
	const MAPBOX = import.meta.env.VITE_MAPBOX_TOKEN;
	const navigate = useNavigate();

	useEffect(() => {
        if (!isEditing) return;

        const fetchProfile = async () => {
            try {
                const response = await fetchWithAuth(`${BASE_URL}/api/profile/general/`);
                
                if (response.ok) {
                    const data = await response.json();
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
				const tokenData = await response.json();
				localStorage.setItem("access_token", tokenData.access);
				if (tokenData?.refresh) localStorage.setItem("refresh_token", tokenData.refresh);

				window.dispatchEvent(new Event("storage"));
	            navigate('/buddies', { state: { justRegistered: true } });
				
	        } else {
	            const errorData = await response.json();
	            setSubmitError(errorData.detail || "Помилка реєстрації. Перевірте дані.");
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
	        setSubmitError("Помилка мережі. Спробуйте пізніше.");
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
	            alert("Дані успішно оновлено!"); 
	        } else {
	            const errorData = await response.json().catch(() => ({}));
	            setSubmitError(errorData.detail || "Не вдалося оновити профіль.");
	            console.error("Помилка оновлення:", errorData);
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
	
	    if (isEditing) {
	        handleUpdate(payload);
	    } else {
	        handleRegister(payload);
	    }
	};

	const handleRetrieve = (res) => {
		const cityName = res.features?.[0]?.properties?.name;

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
    		<Header	/>
        
			<div style={{ padding: "40px 20px 40px 20px" }}>
       			{/* CARD */}
        		<div style={formCardStyle}>
					
				{isEditing && (
					<div style={{
            	        display: "flex",
            	        gap: "15px",
            	        marginBottom: "40px",
            	        width: "100%",
            	        justifyContent: "center",
            	        flexWrap: "wrap"
            	    }}>
            	        <div style={navStepStyle(true)}>1. Базові дані</div>
            	        <div style={navStepStyle(false)} onClick={() => navigate('/profile/personal')}>
            	            2. Про мене
            	        </div>
            	        <div style={navStepStyle(false)} onClick={() => navigate('/profile/housing')}>
            	            3. Проживання
            	        </div>
            	    </div>
            	)}

          			{/* FORM GRID */}
          			<div className='main-grid step1-main-grid'>

            			<div>
            			  	<RequiredLabel>Ім’я</RequiredLabel>
            			  	<SmartBox
								fieldName="first_name"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
            			    	<SmartInput name="first_name" placeholder="Тарас" />
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<RequiredLabel>Прізвище</RequiredLabel>
            			  	<SmartBox
								fieldName="last_name"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
            			    	<SmartInput name="last_name" placeholder="Шевченко" />
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<RequiredLabel>Країна</RequiredLabel>
            			  	<SmartBox
								fieldName="country"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
            			    	<SmartSelect
            			      		options={COUNTRY_OPTIONS}
									placeholder="Країна"
									name="country"
            			    	/>
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<RequiredLabel>Населений пункт</RequiredLabel>
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
            			  	<RequiredLabel>Стать</RequiredLabel>
            			  	<SmartBox
								fieldName="gender"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
            			    	<SmartSelect
            			      		options={GENDER_OPTIONS}
									placeholder="Стать"
									name="gender"
            			    	/>
            			  	</SmartBox>
            			</div>

						<div style={{ position: "relative", zIndex: 1001 }}>
							<RequiredLabel>День Народження</RequiredLabel>
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
							<RequiredLabel>Номер телефону</RequiredLabel>
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
							<RequiredLabel>Електронна пошта</RequiredLabel>
							<SmartBox
								fieldName="email"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<SmartInput
									placeholder="Електронна пошта"
									name="email"
								/>
							</SmartBox>
						</div>

					{!isEditing && (
						<div>
							<RequiredLabel>Пароль</RequiredLabel>
							<SmartBox
								fieldName="password"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
								<PasswordInput name="password"/>
							</SmartBox>
						</div>

					)}

					{!isEditing && (
						<div>
							<RequiredLabel>Підтвердження пароля</RequiredLabel>
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
							btntext={isEditing ? "Оновити" : "Зареєструватися"}
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

function RequiredLabel({ children }) {
	return (
		<div style={labelStyle}>
			{children}
			<span style={requiredAsteriskStyle}> *</span>
		</div>
	);
}

const requiredAsteriskStyle = {
	color: "#ff3333",
};

