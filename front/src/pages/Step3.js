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
				alert("Р РµС”СЃС‚СЂР°С†С–СЏ СѓСЃРїС–С€РЅР°!");
				window.location.href = "/login";
			} else {
				alert("РџРѕРјРёР»РєР° СЂРµС”СЃС‚СЂР°С†С–С—: " + data.message);
			}
		})
		.catch((error) => {
			console.error("Registration error:", error);
			alert("РЎС‚Р°Р»Р°СЃСЏ РїРѕРјРёР»РєР° РїСЂРё СЂРµС”СЃС‚СЂР°С†С–С—. РЎРїСЂРѕР±СѓР№С‚Рµ С‰Рµ СЂР°Р·.");
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
          			<Header onFBClick={this.props.onGoHome} onHomeClick={this.props.onGoHome} />
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
							  	<div style={labelStyle}>РћР±РµСЂС–С‚СЊ СЃРІРѕСЋ РїСЂРµС„РµСЂРµРЅС†С–СЋ</div>
							  	<SmartBox
									mywidth='650px'
									fieldName="room_sharing_preference"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'Р§РѕРјСѓ РІРё РЅР°РґР°С”С‚Рµ РїРµСЂРµРІР°РіСѓ?' },
											{ value: 1, label: 'MРµРЅС– РєРѕРјС„РѕСЂС‚РЅРѕ РґС–Р»РёС‚Рё РєС–РјРЅР°С‚Сѓ Р· СЃРїС–РІРјРµС€РєР°РЅС†РµРј'},
											{ value: 2, label: 'РЇ С…РѕС‡Сѓ РјР°С‚Рё РѕРєСЂРµРјСѓ РєС–РјРЅР°С‚Сѓ'},
										]}
										mywidth='630px'
										placeholder="room_sharing_preference"
									/>
							  	</SmartBox>
							</div>

							{/* WHO TO LIVE WITH */}

							<div style={{ gridColumn: "1 / -1" }}>
							  	<div style={labelStyle}>Р†Р· РєРёРј РІРё Р± С…РѕС‚С–Р»Рё РїСЂРѕР¶РёРІР°С‚Рё?</div>
							  	<SmartBox
									mywidth='650px'
									fieldName="preferred_gender"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'РћР±РµСЂС–С‚СЊ РІР°СЂС–Р°РЅС‚' },
											{ value: 1, label: 'Р›РёС€Рµ Р· С…Р»РѕРїС†СЏРјРё' },
											{ value: 2, label: 'Р›РёС€Рµ Р· РґС–РІС‡Р°С‚Р°РјРё' },
											{ value: 3, label: 'РќРµ РјР°С” Р·РЅР°С‡РµРЅРЅСЏ' },
										]}
										mywidth='630px'
										placeholder="preferred_gender"
									/>
							  	</SmartBox>
							</div>

							{/* HOUSING STATUS */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Р©Рѕ РЅР°Р№РєСЂР°С‰Рµ РѕРїРёСЃСѓС” РІР°С€Сѓ СЃРёС‚СѓР°С†С–СЋ?</div>
								<SmartBox
									mywidth='650px'
									fieldName="housing_status"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'РћР±РµСЂС–С‚СЊ РІР°СЂС–Р°РЅС‚' },
											{ value: 1, label: 'РЇ С€СѓРєР°СЋ Р¶РёС‚Р»Рѕ С‚Р° СЃРїС–РІРјРµС€РєР°РЅС†СЏ' },
											{ value: 2, label: 'РЇ С€СѓРєР°СЋ Р»РёС€Рµ СЃРїС–РІРјРµС€РєР°РЅС†СЏ, РјР°СЋ СЃРІРѕС”/РѕСЂРµРЅРґРѕРІР°РЅРµ Р¶РёС‚Р»Рѕ' },
										]}
										mywidth='630px'
										placeholder="housing_status"
									/>
								</SmartBox>
							</div>

							{/* BUDGET */}

							<div>
								<div style={{...labelStyle, marginBottom: "8px", marginTop: "14px"}}>РЇРєРёР№ РІР°С€ Р±СЋРґР¶РµС‚?</div>
								<SmartBox
									fieldName="budget"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput
										placeholder="Р’РєР°Р¶С–С‚СЊ СЃСѓРјСѓ РІ РіСЂРЅ"
										type="number"
										step="100"
										prefix="в‚ґ"
									/>
								</SmartBox>
							</div>

							{/* DISTRICT */}

							<div>
								<div style={{...labelStyle, marginBottom: "0px"}}>Р Р°Р№РѕРЅ/-Рё РїСЂРѕР¶РёРІР°РЅРЅСЏ</div>
								<div style={{
									fontSize: "12px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px",
									marginBottom: "6px"
								}}>РћР±РµСЂС–С‚СЊ Р±Р°Р¶Р°РЅРёР№ СЂР°Р№РѕРЅ/СЂР°Р№РѕРЅРё РїСЂРѕР¶РёРІР°РЅРЅСЏ</div>
								<SmartBox
									fieldName="preferred_districts"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										isMulti
										options={[
											{ value: 0, label: 'РћР±РµСЂС–С‚СЊ СЂР°Р№РѕРЅ/-Рё' }
										]}
										placeholder="districts"
									/>
								</SmartBox>
							</div>

							{/* TERM */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>РќР° СЏРєРёР№ С‚РµСЂРјС–РЅ РїР»Р°РЅСѓС”С‚Рµ РїСЂРѕР¶РёРІР°РЅРЅСЏ?</div>
								<SmartBox
									mywidth="650px"
									fieldName="planned_duration"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="Р’Р°С€ С‚РµСЂРјС–РЅ РїСЂРѕР¶РёРІР°РЅРЅСЏ"/>
								</SmartBox>
							</div>

							{/* LOOKING FOR */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>РљРѕР»Рё РїР»Р°РЅСѓС”С‚Рµ РїРѕС‡Р°С‚Рё РїСЂРѕР¶РёРІР°РЅРЅСЏ?</div>
								<SmartBox
									mywidth="650px"
									fieldName="move_in_date"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="Р’Р°С€Р° РґР°С‚Р° РїРѕС‡Р°С‚РєСѓ РїСЂРѕР¶РёРІР°РЅРЅСЏ"/>
								</SmartBox>
							</div>

							{/* PET */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Р§Рё С” Сѓ РІР°СЃ РґРѕРјР°С€РЅС–Р№ СѓР»СЋР±Р»РµРЅРµС†СЊ?</div>
								<SmartBox
									mywidth="650px"
									fieldName="has_pet"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										options={[
											{ value: 0, label: 'РћР±РµСЂС–С‚СЊ РІР°СЂС–Р°РЅС‚' },
											{ value: true, label: 'РўР°Рє, С”' },
											{ value: false, label: 'РќС–, РЅРµРјР°' },
										]}
										mywidth='630px'
										placeholder="pet"
									/>
								</SmartBox>
							</div>

							{/* PET DESCRIPTION */}

							{formState.has_pet?.realValue === true && (
								<div style={{ gridColumn: "1 / -1" }}>
									<div style={labelStyle}>Р РѕР·РєР°Р¶С–С‚СЊ РїСЂРѕ СЃРІРѕС—С… СѓР»СЋР±Р»РµРЅС†С–РІ</div>
									<SmartBox
										mywidth="650px"
										fieldName="pet_description"
										formState={formState}
										setFormState={this.setFormState}
									>
										<SmartText placeholder="Р’Р°С€С– СѓР»СЋР±Р»РµРЅС†С–"/>
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
								btntext="< РќР°Р·Р°Рґ"
							/> */}

							<SubmitBtn
								onClick={this.handleSubmit}
								disabled={!isFormValid(formState)}
								btntext="РќР°РґС–СЃР»Р°С‚Рё"
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


