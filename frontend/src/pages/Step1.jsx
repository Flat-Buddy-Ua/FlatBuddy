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
	{ value: 0, label: "Виберіть країну" },
	{ value: 1, label: "Україна" }
];
	
const GENDER_OPTIONS = [
	{ value: 0, label: "Виберіть вашу стать" },
    { value: 1, label: "Чоловіча" },
    { value: 2, label: "Жіноча" },
    { value: 3, label: "Інша" },
];

export default function Step1 ({ isEditing }) {
	const [formState, setFormState] = React.useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const BASE_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const getObjValue = (optArray, value) => {
		return optArray.find(opt => opt.value === value) || null;
	}

	useEffect(() => {
        if (!isEditing) return;

        const fetchProfile = async () => {
            try {
                const BASE_URL = import.meta.env.VITE_API_URL;
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

                    // 1. Знаходимо повні об'єкти для селектів за їхніми ID, які прийшли з бекенду
                    // Зверни увагу: використовуємо просто data.country, а не data.country.value
                    const selectedCity = CityOptions.find(opt => opt.value === data.city) || 
    					(data.city ? { value: data.city, label: data.city } : null);
                    const selectedCountry = COUNTRY_OPTIONS.find(opt => opt.value === data.country) || null;
                    const selectedGender = GENDER_OPTIONS.find(opt => opt.value === data.gender) || null;

                    // 2. Оновлюємо стейт
                    setFormState(prevState => ({
                        ...prevState,
                        
                        first_name: { value: data.first_name, realValue: data.first_name, isValid: true },
                        last_name: { value: data.last_name, realValue: data.last_name, isValid: true },
                        
                        // Для селектів передаємо знайдений об'єкт повністю у realValue
                        country: { 
                            value: selectedCountry?.label || "", // Текстова назва для відображення
                            realValue: selectedCountry,          // Об'єкт для SmartSelect та відправки на бек
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

					// Пробігаємось по всіх полях, які прислали помилку (напр. "email", "phone_number")
					Object.keys(errorData).forEach(fieldName => {
						// Перевіряємо, чи є таке поле у нашій формі
						if (newState[fieldName]) {
							newState[fieldName] = {
								...newState[fieldName], // зберігаємо введене value/realValue
								isValid: false,         // робимо поле невалідним (щоб SmartBox став червоним)
								// DRF зазвичай віддає масив рядків, тому беремо перший елемент [0]
								errorText: Array.isArray(errorData[fieldName]) 
									? errorData[fieldName][0] 
									: errorData[fieldName]
							};
						}
					});

					// Якщо бекенд прислав помилку, не прив'язану до конкретного поля
					if (errorData.non_field_errors) {
						alert(errorData.non_field_errors[0]); // Можеш потім замінити на гарний Toast
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
            	        <div 
            	            style={navStepStyle(false, true)} 
            	            aria-disabled="true"
            	        >
            	            2. Проживання
            	        </div>
            	        <div 
            	            style={navStepStyle(false, true)} 
            	            aria-disabled="true"
            	        >
            	            3. Про мене
            	        </div>
            	    </div>
            	)}

          			{/* FORM GRID */}
          			<div className='main-grid step1-main-grid'>

            			<div>
            			  	<div style={labelStyle}>Ім’я</div>
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
            			  	<div style={labelStyle}>Прізвище</div>
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
            			  	<div style={labelStyle}>Країна</div>
            			  	<SmartBox
								fieldName="country"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
            			    	<SmartSelect
            			      		options={COUNTRY_OPTIONS}
									defaultValue={COUNTRY_OPTIONS[0]}
									placeholder="Країна"
									name="country"
            			    	/>
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<div style={labelStyle}>Місто</div>
            			  	<SmartBox
								fieldName="city"
								formState={formState}
								setFormState={setFormState}
								mywidth="100%"
							>
            			    	<SmartCreatable
            			      		options={CityOptions}
									defaultValue={CityOptions[0]}
									placeholder="Місто"
									name="city"
            			    	/>
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<div style={labelStyle}>Стать</div>
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
							<div style={labelStyle}>День Народження</div>
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
							<div style={labelStyle}>Номер телефону</div>
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
							<div style={labelStyle}>Електронна пошта</div>
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
							<div style={labelStyle}>Пароль</div>
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
							<div style={labelStyle}>Підтвердження пароля</div>
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

