import React, { PureComponent } from 'react';
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

function buildRegistrationPayload(formState) {
	const result = {};

	Object.keys(formState).forEach((key) => {
		result[key] = formState[key].realValue;
	});
		
	return result;
}

export class Step2 extends PureComponent {
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
			if (!data.success) {
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
		const { onNext } = this.props;
		
		const REQUIRED_FIELDS = [
  			"university",
			"faculty",
			"course",
			"languages",
			"political_coordinate_economic",
			"political_coordinate_social",
			"cleanliness",
			"schedule",
			"style_of_life",
			"sleep_schedule",
			"bad_habits",
			"mbti",
			"hobby",
			"biography",
			"looking_for",
			"photo",
			"intro_extrovert"
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

		const { isHoveredMBTI } = this.state;

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
          				<div className='submain-grid'>
							<div style={labelStyle}>Р¤РѕС‚РѕРіСЂР°С„С–СЏ РїСЂРѕС„С–Р»СЋ</div>
          				</div>

						<div style={{
							position: "relative",
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginBottom: "30px"
						}}>
							
								<UploadPhoto
									onChange={(file) => 
										this.setFormState("photo", file, true)
									}
								/>
						</div>

          				{/* FORM GRID */}
          				<div className='main-grid'>

							{/* UNIVER */}

							<div>
								<div style={labelStyle}>Р—Р°РєР»Р°Рґ РѕСЃРІС–С‚Рё</div>
								<SmartBox
									fieldName="university"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartCreatable
										placeholder="РћР±РµСЂС–С‚СЊ Р°Р±Рѕ РІРІРµРґС–С‚СЊ СЃРІС–Р№ СѓРЅС–РІРµСЂСЃРёС‚РµС‚"
										options={UniversityOptions}
									/>
								</SmartBox>
							</div>

							{/* FACULTY */}

							<div>
								<div style={labelStyle}>РЎРїРµС†С–Р°Р»С–Р·Р°С†С–СЏ</div>
								<SmartBox
									fieldName="faculty"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput placeholder="РќР°РїСЂРёРєР»Р°Рґ, РљРѕРјРї'СЋС‚РµСЂРЅС– РЅР°СѓРєРё" />
								</SmartBox>
							</div>
							
							{/* COURSE */}

							<div>
								<div style={{...labelStyle, marginBottom: "8px", marginTop: "14px"}}>РљСѓСЂСЃ</div>
								<SmartBox
									fieldName="course"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput placeholder="РќР°РїСЂРёРєР»Р°Рґ, 2-Р№ РєСѓСЂСЃ" />
								</SmartBox>
							</div>

							{/* LANGUAGES */}

							<div>
								<div style={{...labelStyle, marginBottom: "0px"}}>РњРѕРІРё</div>
								<div style={{
									fontSize: "12px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px",
									marginBottom: "6px"
								}}>Р”РѕРїСѓСЃС‚РёРјС– РјРѕРІРё СЃРїС–Р»РєСѓРІР°РЅРЅСЏ</div>
								<SmartBox
									fieldName="languages"
									formState={formState}
									setFormState={this.setFormState}
								>
									<MultiSelect
										options={languageOptions}
										placeholder="РћР±РµСЂС–С‚СЊ РјРѕРІРё"
									/>
								</SmartBox>
							</div>

							{/* POLITICAL AND ECONOMIC COORDINATES */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>РџРѕР»С–С‚РёС‡РЅР° РєРѕРѕСЂРґРёРЅР°С‚Р°</div>
								<div style={{
									fontSize: "12px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px",
									marginBottom: "6px"
								}}>
									<p>РЇРєС‰Рѕ РІРё РЅРµ Р·РЅР°С”С‚Рµ СЃРІРѕС”С— РїРѕР»С–С‚РёС‡РЅРѕС— РєРѕРѕСЂРґРёРЅР°С‚Рё, РїСЂРѕР№РґС–С‚СЊ С‚РµСЃС‚ Р·Р° РїРѕСЃРёР»Р°РЅРЅСЏРј
										<br />
											<a href="https://www.idrlabs.com/political-coordinates/test.php">
												https://www.idrlabs.com/political-coordinates/test.php
											</a>
									</p>
								</div>
							</div>

							<div style={{marginTop: "-20px"}}>
								<input
									className='slider'
									type='range'
									defaultValue='0'
									min='-100'
									max='100'
									onChange={(e) => {
										// console.log(e.target.value);
										this.setFormState(
											"political_coordinate_economic",
											e.target.value,
											true
										);
									}}
									list='markers'
								/>

								<div style={{
									display: "flex",
									justifyContent: "space-between",
									fontSize: "12px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px"
								}}>
									<span>Р›С–РІРёР№</span>
									<span style={{marginLeft: "16px", fontSize: "21px", pointerEvents: "none"}}>В·</span>
									<span>РџСЂР°РІРёР№</span>
								</div>
							</div>

							<div style={{marginTop: "-20px"}}>
								<input
									className='slider'
									type='range'
									defaultValue='0'
									min='-100'
									max='100'
									onChange={(e) => {
										// console.log(e.target.value);
										this.setFormState(
											"political_coordinate_social",
											e.target.value,
											true
										);
									}}
								/>

								<div style={{
									display: "flex",
									justifyContent: "space-between",
									fontSize: "12px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px"
								}}>
									<span>Р›С–Р±РµСЂР°Р»СЊРЅРёР№</span>
									<span style={{marginLeft: "11px", fontSize: "21px", pointerEvents: "none"}}>В·</span>
									<span>РљРѕРјСѓРЅС–С‚Р°СЂРЅРёР№</span>
								</div>
							</div>

							{/* CLEANLINESS */}

							<div>
								<div style={labelStyle}>РћС…Р°Р№РЅС–СЃС‚СЊ</div>
								<SmartBox
									fieldName="cleanliness"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartInput
										placeholder="Р’Р°С€Р° РѕС…Р°Р№РЅС–СЃС‚СЊ РІС–Рґ 1 РґРѕ 5"
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
								<div style={labelStyle}>Р РѕР·РєР»Р°Рґ</div>
								<SmartBox
									fieldName="schedule"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="РћРїРёС€С–С‚СЊ РІР°С€ СЂРѕР·РєР»Р°Рґ"/>
								</SmartBox>
							</div>

							{/* STYLE OF LIFE */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>РЎС‚РёР»СЊ Р¶РёС‚С‚СЏ</div>
								<SmartBox
									mywidth="650px"
									fieldName="style_of_life"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="РћРїРёС€С–С‚СЊ РІР°С€ СЃС‚РёР»СЊ Р¶РёС‚С‚СЏ"/>
								</SmartBox>
							</div>

							{/* SLEEP SCHEDULE */}

							<div>
								<div style={labelStyle}>Р“СЂР°С„С–Рє СЃРЅСѓ</div>
								<SmartBox
									fieldName="sleep_schedule"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="РћРїРёС€С–С‚СЊ РІР°С€ РіСЂР°С„С–Рє СЃРЅСѓ"/>
								</SmartBox>
							</div>

							{/* BAD HABITS */}

							<div>
								<div style={labelStyle}>РЁРєС–РґР»РёРІС– Р·РІРёС‡РєРё</div>
								<SmartBox
									fieldName="bad_habits"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="РћРїРёС€С–С‚СЊ РІР°С€С– С€РєС–РґР»РёРІС– Р·РІРёС‡РєРё"/>
								</SmartBox>
							</div>

							{/* MBTI */}

							<div>
								<div style={{...labelStyle}}>MBTI</div>
								<SmartBox
									fieldName="mbti"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartSelect
										placeholder="РћР±РµСЂС–С‚СЊ РІР°С€ MBTI С‚РёРї"
										options={MBTI}
									/>
								</SmartBox>
								<div style={{marginTop: "4px"}}>
									<span
										style={{
											fontSize: "14px",
											fontFamily: "Inter",
											color: "#000",
											marginRight: "8px",
										}}
									>РЇРєС‰Рѕ РЅРµ Р·РЅР°С”С€ СЃРІС–Р№ С‚РёРї:</span>
									<button
										type='button'
										onClick={() => this.handleLinkClick('https://www.16personalities.com/uk/bezkoshtovnyy-test-na-vyznachennya-osobystosti')}
										onMouseEnter={() => this.setState({ isHoveredMBTI: true })}
										onMouseLeave={() => this.setState({ isHoveredMBTI: false })}
										style={{
											fontSize: "12px",
											fontFamily: "Inter",
											color: "#000",
											padding: "6px 8px 8px 6px",
											marginTop: "6px",
											backgroundColor: isHoveredMBTI ? "#FFF8F5" : "#FFFFFF",
											border: isHoveredMBTI ? "2px solid transparent" : "2px solid #F6DDD4",
											borderRadius: "4px",
										}}>
										рџ”— РўРµСЃС‚ MBTI
									</button>
								</div>
							</div>

							{/* INTRO-/EXTROVERT */}

							<div>
								<div style={labelStyle}>Р†РЅС‚СЂРѕРІРµСЂС‚/РµРєСЃС‚СЂР°РІРµСЂС‚</div>
								<input
									className='slider'
									type='range'
									defaultValue='0'
									min='-1'
									max='1'
									step='1'
									onChange={(e) => {
										// console.log(e.target.value);
										this.setFormState(
											"intro_extrovert",
											e.target.value,
											true
										);
									}}
								/>
								{/* <div style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									fontSize: "20px",
									fontFamily: "Inter",
									color: "#000",
									marginTop: "-4px"
								}}>
									<span>В·</span>
									<span style={{marginLeft: '4px'}}>В·</span>
									<span>В·</span>
								</div> */}
								
								<div style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									fontSize: "14px",
									fontFamily: "Inter",
									color: "#000",
								}}>
									<span>Р†РЅС‚СЂРѕРІРµСЂС‚</span>
									<span style={{marginLeft: '12px'}}>РђРјР±С–РІРµСЂС‚</span>
									<span>Р•РєСЃС‚СЂР°РІРµСЂС‚</span>
								</div>
							</div>

							{/* HOBBY */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Р—Р°С…РѕРїР»РµРЅРЅСЏ/С…РѕР±Р±С–</div>
								<SmartBox
									mywidth="650px"
									fieldName="hobby"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="Р РѕР·РєР°Р¶С–С‚СЊ РїСЂРѕ СЃРІРѕС— Р·Р°С…РѕРїР»РµРЅРЅСЏ С‚Р° С…РѕР±Р±С–"/>
								</SmartBox>
							</div>

							{/* BIOGRAPHY */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>Р‘С–РѕРіСЂР°С„С–СЏ</div>
								<SmartBox
									mywidth="650px"
									fieldName="biography"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="Р‘С–РѕРіСЂР°С„С–СЏ"/>
								</SmartBox>
							</div>

							{/* LOOKING FOR */}

							<div style={{ gridColumn: "1 / -1" }}>
								<div style={labelStyle}>РљРѕРіРѕ С€СѓРєР°С”С‚Рµ</div>
								<SmartBox
									mywidth="650px"
									fieldName="looking_for"
									formState={formState}
									setFormState={this.setFormState}
								>
									<SmartText placeholder="РћРїРёС€С–С‚СЊ РІР°С€РѕРіРѕ С€СѓРєР°РЅРѕРіРѕ buddy"/>
								</SmartBox>
							</div>
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
								onClick={
									() => {
										this.handleSubmit();
										onNext();
									}
								}
								disabled={!isFormValid(formState)}
								btntext="Р”Р°Р»С– >"
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


