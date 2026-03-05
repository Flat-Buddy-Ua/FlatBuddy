import React, { PureComponent } from 'react';
import { SmartSelect } from '../components/SmartSelect.jsx';
import { SmartInput } from '../components/SmartInput.jsx';
import { SmartText } from '../components/SmartText.jsx';
import { SmartBox } from '../components/SmartBox.jsx';
import { Header } from '../components/Header.jsx';
import { SubmitBtn } from '../components/SubmitBtn.jsx';

function buildRegistrationPayload(formState) {
	const result = {};

	Object.keys(formState).forEach((key) => {
		result[key] = formState[key].realValue;
	});
		
	return result;
}

export class Step3 extends PureComponent {
  	constructor(props) {
		super(props);
		this.state = {
			formState: {},
		};
  	}

  	setFormState = (fieldName, value, isValid) => {
		const realValue = value && value.value !== undefined ? value.value : value;

		this.setState((prevState) => ({
			formState: {
			...prevState.formState,
			[fieldName]: { realValue, isValid },
			},
		}));
	};

	handleSubmit = async () => {
		const payload = buildRegistrationPayload(this.state.formState);
	
		// localStorage.setItem(
		// 	"registrationDraft_2",
		// 	JSON.stringify(payload, null, 2)
		// );
		
		await fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
		.then((res) => res.json())
		.then((data) => {
			console.log("Registration response:", data);
			if (data.success) {
				alert("Реєстрація успішна!");
				window.location.href = "/login";
			} else {
				alert("Помилка реєстрації: " + data.message);
			}
		})
		.catch((error) => {
			console.error("Registration error:", error);
			alert("Сталася помилка при реєстрації. Спробуйте ще раз.");
		});
  	};

	handleLinkClick = (url) => {
		window.open(url, '_blank');
	};

	
	render() {
		const { formState } = this.state;
		const { onNext, onBack } = this.props;
		
		const REQUIRED_FIELDS = [
  			"room_sharing_preference",
			"preferred_gender",
			"housing_status",
			"budget",
			"preferred_districts",
			"planned_duration",
			"move_in_date",
			"has_pet",
			...(formState.has_pet?.realValue === true ? ["pet_description"] : [])
		];


		function isFormValid(formState) {
			console.log("Validating form...", formState);

  			for (const field of REQUIRED_FIELDS) {
				// console.log("Checking field:", field, formState[field]);
    			if (!formState[field]) return false;
  			}
			console.log("Form is valid");

  			return Object.values(formState).every(
    			field => field.isValid === true
  			);

		}

    	return (
      		<div>
        		<div className='header-grid'>
          			<Header
						onFBClick={this.props.onGoHome}
						onHomeClick={this.props.onGoHome}
						onLoginClick={this.props.onLoginClick}
						onFindRoommateClick={this.props.onFindRoommate}
					/>
        		</div>
        
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

							{/* ADVANTAGES */}

							<div style={{ gridColumn: "1 / -1" }}>
							  	<div style={labelStyle}>Оберіть свою преференцію</div>
							  	<SmartBox
									mywidth='650px'
									fieldName="room_sharing_preference"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'Чому ви надаєте перевагу?' },
											{ value: 1, label: 'Mені комфортно ділити кімнату з співмешканцем'},
											{ value: 2, label: 'Я хочу мати окрему кімнату'},
										]}
										mywidth='630px'
										placeholder="room_sharing_preference"
									/>
							  	</SmartBox>
							</div>

							{/* WHO TO LIVE WITH */}

							<div style={{ gridColumn: "1 / -1" }}>
							  	<div style={labelStyle}>Із ким ви б хотіли проживати?</div>
							  	<SmartBox
									mywidth='650px'
									fieldName="preferred_gender"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'Оберіть варіант' },
											{ value: 1, label: 'Лише з хлопцями' },
											{ value: 2, label: 'Лише з дівчатами' },
											{ value: 3, label: 'Не має значення' },
										]}
										mywidth='630px'
										placeholder="preferred_gender"
									/>
							  	</SmartBox>
							</div>

							{/* HOUSING STATUS */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Що найкраще описує вашу ситуацію?</div>
								<SmartBox
									mywidth='650px'
									fieldName="housing_status"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'Оберіть варіант' },
											{ value: 1, label: 'Я шукаю житло та співмешканця' },
											{ value: 2, label: 'Я шукаю лише співмешканця, маю своє/орендоване житло' },
										]}
										mywidth='630px'
										placeholder="housing_status"
									/>
								</SmartBox>
							</div>

							{/* BUDGET */}

							<div>
								<div style={{...labelStyle, marginBottom: "8px", marginTop: "14px"}}>Який ваш бюджет?</div>
								<SmartBox
									fieldName="budget"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput
										placeholder="Вкажіть суму в грн"
										type="number"
										step="100"
										prefix="₴"
									/>
								</SmartBox>
							</div>

							{/* DISTRICT */}

							<div>
								<div style={{...labelStyle, marginBottom: "0px"}}>Район/-и проживання</div>
								<div style={{
									fontSize: "12px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px",
									marginBottom: "6px"
								}}>Оберіть бажаний район/райони проживання</div>
								<SmartBox
									fieldName="preferred_districts"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										isMulti
										options={[
											{ value: 0, label: 'Оберіть район/-и' }
										]}
										placeholder="districts"
									/>
								</SmartBox>
							</div>

							{/* TERM */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>На який термін плануєте проживання?</div>
								<SmartBox
									mywidth="650px"
									fieldName="planned_duration"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="Ваш термін проживання"/>
								</SmartBox>
							</div>

							{/* LOOKING FOR */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Коли плануєте почати проживання?</div>
								<SmartBox
									mywidth="650px"
									fieldName="move_in_date"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="Ваша дата початку проживання"/>
								</SmartBox>
							</div>

							{/* PET */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Чи є у вас домашній улюбленець?</div>
								<SmartBox
									mywidth="650px"
									fieldName="has_pet"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'Оберіть варіант' },
											{ value: true, label: 'Так, є' },
											{ value: false, label: 'Ні, нема' },
										]}
										mywidth='630px'
										placeholder="pet"
									/>
								</SmartBox>
							</div>

							{/* PET DESCRIPTION */}

							{formState.has_pet?.realValue === true && (
								<div style={{ gridColumn: "1 / -1" }}>
									<div style={labelStyle}>Розкажіть про своїх улюбленців</div>
									<SmartBox
										mywidth="650px"
										fieldName="pet_description"
										formState={formState}
										setFormState={this.setFormState}
									>
										<SmartText placeholder="Ваші улюбленці"/>
									</SmartBox>
								</div>
							)}
          				</div>
									
						{/* SUBMIT BUTTON */}
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignContent: "center",
								marginTop: "36px"
							}}
						>
							{/* <SubmitBtn
								onClick={onBack}
								btntext="< Назад"
							/> */}

							<SubmitBtn
								onClick={this.handleSubmit}
								disabled={!isFormValid(formState)}
								btntext="Надіслати"
							/>
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



