import React, { PureComponent } from 'react';
import { SmartSelect } from './components/SmartSelect';
import { SmartInput } from './components/SmartInput';
import { SmartBox } from './components/SmartBox';
import { SmartCreatable } from './components/SmartCreatable';
import { CityOptions } from './components/CityOptions';
import { Header } from './components/Header';
import SmartCalendar from './components/SmartCalendar';
import { PasswordInput } from './components/PasswordInfo';
import { PassConfirm } from './components/PassConfirm';
import { SubmitBtn } from './components/SubmitBtn';

function buildRegistrationPayload(formState) {
	const result = {};

	Object.keys(formState).forEach((key) => {
		result[key] = formState[key].value;
	});
		
	return result;
}

export class MAIN extends PureComponent {
  	constructor(props) {
		super(props);
		this.state = {
			formState: {},
		};
  	}

  	setFormState = (fieldName, value, isValid) => {
		this.setState((prevState) => ({
			formState: {
			...prevState.formState,
			[fieldName]: { value, isValid },
			},
		}));
	};

	handleSubmit = () => {
		const payload = buildRegistrationPayload(this.state.formState);
	
		console.log("REGISTRATION JSON:", payload);
	
		localStorage.setItem(
			"registrationDraft",
			JSON.stringify(payload, null, 2)
		);
	};

  	render() {
		const { formState } = this.state;

		const REQUIRED_FIELDS = [
  			"firstName",
  			"lastName",
			// "country",
			"city",
			"gender",
			"birthDate",
  			"phone",
  			"email",
  			"password",
  			"passwordConfirm"
		];


		function isFormValid(formState) {

  			for (const field of REQUIRED_FIELDS) {
    			if (!formState[field]) return false;
  			}

  			return Object.values(formState).every(
    			field => field.isValid === true
  			);
		}	

    	return (
      		<div>
        		<div className='header-grid'>
          			<Header />
        		</div>
        
				<div style={{ padding: "40px" }}>
       				{/* CARD */}
        			<div style={{
						width: "100%",
          				border: "3px solid #F6DDD4",
          				padding: "40px",
          				maxWidth: 800,
          				margin: "auto",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
        			}}>
					
          				{/* FORM GRID */}
          				<div
            				className='main-grid'
            				style={{
              					display: "grid",
              					gap: "40px",
              					gridTemplateColumns: "1fr 1fr",
            				}}
          				>

            				{/* FIELD 1 */}
            				<div>
            				  	<div style={labelStyle}>Ім’я</div>
            				  	<SmartBox
									fieldName="firstName"
									formState={formState}
									setFormState={this.setFormState}
								>
            				    	<SmartInput placeholder="Тарас" />
            				  	</SmartBox>
            				</div>

            				{/* FIELD 2 */}
            				<div>
            				  	<div style={labelStyle}>Прізвище</div>
            				  	<SmartBox
									fieldName="lastName"
									formState={formState}
									setFormState={this.setFormState}
								>
            				    	<SmartInput placeholder="Шевченко" />
            				  	</SmartBox>
            				</div>

            				{/* FIELD 3 */}
            				<div>
            				  	<div style={labelStyle}>Країна</div>
            				  	<SmartBox
									fieldName="country"
									formState={formState}
									setFormState={this.setFormState}
								>
            				    	<SmartSelect
            				      		options={[{ value: "ua", label: "Україна" }]}
            				      		defaultValue={{ value: "ua", label: "Україна" }}
            				    	/>
            				  	</SmartBox>
            				</div>

            				{/* FIELD 4 */}
            				<div>
            				  	<div style={labelStyle}>Місто</div>
            				  	<SmartBox
									fieldName="city"
									formState={formState}
									setFormState={this.setFormState}
								>
            				    	<SmartCreatable
            				      		options={CityOptions}
            				      		defaultValue={CityOptions.find(o => o.value === "kyiv")}
            				    	/>
            				  	</SmartBox>
            				</div>

            				{/* FIELD 5 */}
            				<div>
            				  	<div style={labelStyle}>Стать</div>
            				  	<SmartBox
									fieldName="gender"
									formState={formState}
									setFormState={this.setFormState}
								>
            				    	<SmartSelect
            				      		options={[
            				        		{ value: "male", label: "Чоловіча" },
            				        		{ value: "female", label: "Жіноча" },
            				        		{ value: "other", label: "Інша" },
            				      		]}
            				      		// defaultValue={{ value: "male", label: "Чоловіча" }}
            				    	/>
            				  	</SmartBox>
            				</div>

							{/* FIELD 6 */}
							<div>
								<div style={labelStyle}>День Народження</div>
								<SmartBox
									fieldName="birthDate"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartCalendar />
								</SmartBox>
							</div>

							{/* FIELD 7 */}
							<div>
								<div style={labelStyle}>Номер телефону</div>
								<SmartBox
									fieldName="phone"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput
										placeholder="+38(0__)-___-__-__"
										mask="+38(099)-999-99-99"
									/>
								</SmartBox>
							</div>

							{/* FIELD 8 */}
							<div>
								<div style={labelStyle}>Email</div>
								<SmartBox
									fieldName="email"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput
										placeholder="Email"
									/>
								</SmartBox>
							</div>

							{/* FIELD 9 */}
							<div>
								<div style={labelStyle}>Пароль</div>
								<SmartBox
									fieldName="password"
									formState={formState}
									setFormState={this.setFormState}
								>
									<PasswordInput placeholder="password" />
								</SmartBox>
							</div>

							{/* FIELD 10 */}
							<div>
								<div style={labelStyle}>Підтвердження пароля</div>
								<SmartBox
									fieldName="passwordConfirm"
									formState={formState}
									setFormState={this.setFormState}
									disabled={!formState.password?.isValid}
								>
									<PassConfirm
										disabled={!formState.password?.isValid}
										placeholder="passConfirm"
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
							<SubmitBtn onClick={this.handleSubmit} disabled={!isFormValid(formState)}>
								Зареєструватися
							</SubmitBtn>
						</div>
        			</div>
				</div>
      		</div>
    	);
  	}
}

const labelStyle = {
  marginBottom: 8,
  fontSize: 18,
  fontFamily: "Seenonim",
  color: "#000",
};

