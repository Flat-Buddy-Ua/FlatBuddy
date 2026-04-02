import React, { PureComponent } from 'react';
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

function buildRegistrationPayload(formState) {
	const result = {};
	Object.keys(formState).forEach((key) => {
		result[key] = formState[key].realValue;
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

export default function Step1 ({ isEditing }) {
	const [formState, setFormState] = React.useState({});
	const navigate = useNavigate();

  	const handleFieldChange = (fieldName, value, isValid) => {
		const realValue = value && value.value !== undefined ? value.value : value;

		setFormState((prevState) => ({
        	...prevState,
        	[fieldName]: { realValue, isValid },
    	}));
	};

	const isFormValid = (formState) => {
  		for (const field of REQUIRED_FIELDS) {
    		if (!formState[field]) return false;
  		}

  		return Object.values(formState).every(field => field.isValid === true);
	}

	const handleSubmit = async () => {
		if (!isFormValid(formState)) {
			alert("Будь ласка, заповніть всі обов'язкові поля правильно.");
			return;
		}

		const payload = buildRegistrationPayload(formState);

		try {
			const response = await fetch("https://flatbuddyua.com/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();	
			console.log("Registration response:", data);

			if (data.success) {
				alert("Реєстрація успішна");
				navigate("/login");
			} else {
				alert("Помилка реєстрації: " + data.message);
			}
		} catch (error) {
			console.error("Registration error:", error);
			alert("Сталася помилка при реєстрації. Спробуйте ще раз.");
		}	

  	};

    return (
  		<div className="landing-page">
    		<Header
			    onFBClick={() => navigate('/')}
			    onHomeClick={() => navigate('/')}
			    onLoginClick={() => navigate('/login')}
			    onFindRoommateClick={() => navigate('/register')}
			/>
        
			<div style={{ padding: "40px 20px 40px 20px" }}>
       			{/* CARD */}
        		<div style={{
					width: "100%",
        			border: "3px solid #F6DDD4",
        			padding: "80px",
        			maxWidth: 800,
        			margin: "auto",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
        		}}>
					
          			{/* FORM GRID */}
          			<div className='main-grid'>

            			<div>
            			  	<div style={labelStyle}>Ім’я</div>
            			  	<SmartBox
								fieldName="first_name"
								formState={formState}
								setFormState={handleFieldChange}
							>
            			    	<SmartInput name="first_name" placeholder="Тарас" />
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<div style={labelStyle}>Прізвище</div>
            			  	<SmartBox
								fieldName="last_name"
								formState={formState}
								setFormState={handleFieldChange}
							>
            			    	<SmartInput name="last_name" placeholder="Шевченко" />
            			  	</SmartBox>
            			</div>

            			<div>
            			  	<div style={labelStyle}>Країна</div>
            			  	<SmartBox
								fieldName="country"
								formState={formState}
								setFormState={handleFieldChange}
							>
            			    	<SmartSelect
            			      		options={[
										{ value: 0, label: "Виберіть країну" },
										{ value: 1, label: "Україна" }
									]}
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
								setFormState={handleFieldChange}
							>
            			    	<SmartCreatable
            			      		options={CityOptions}
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
								setFormState={handleFieldChange}
							>
            			    	<SmartSelect
            			      		options={[
										{ value: 0, label: "Виберіть вашу стать" },
            			        		{ value: 1, label: "Чоловіча" },
            			        		{ value: 2, label: "Жіноча" },
            			        		{ value: 3, label: "Інша" },
            			      		]}
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
								setFormState={handleFieldChange}
							>
								<SmartCalendar />
							</SmartBox>
						</div>

						<div>
							<div style={labelStyle}>Номер телефону</div>
							<SmartBox
								fieldName="phone_number"
								formState={formState}
								setFormState={handleFieldChange}
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
								setFormState={handleFieldChange}
							>
								<SmartInput
									placeholder="Електронна пошта"
									name="email"
								/>
							</SmartBox>
						</div>

						<div>
							<div style={labelStyle}>Пароль</div>
							<SmartBox
								fieldName="password"
								formState={formState}
								setFormState={handleFieldChange}
							>
								<PasswordInput name="password"/>
							</SmartBox>
						</div>

						<div>
							<div style={labelStyle}>Підтвердження пароля</div>
							<SmartBox
								fieldName="repeat_password"
								formState={formState}
								setFormState={handleFieldChange}
								disabled={!formState.password?.isValid}
							>
								<PassConfirm
									disabled={!formState.password?.isValid}
									name="repeat_password"
								/>
							</SmartBox>
						</div>
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
							onClick={() => {
								handleSubmit();
								// onNext();
							}}
							disabled={!isFormValid(formState)}
							btntext="Зареєструватися"
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

