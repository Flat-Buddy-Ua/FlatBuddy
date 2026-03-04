import React, { PureComponent } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { MAIN } from "./MAIN";
import { Card } from "./Card";

export class RegisterLayout extends PureComponent {
  	state = {
    	step: 0,
    	formData: {
      		email: "",
      		password: "",
      		name: "",
      		isON: false,
    	},
  	};
	
  	nextStep = () => {
    	this.setState((prev) => ({ step: Math.min(prev.step + 1, 3) }));
  	};

  	prevStep = () => {
    	this.setState((prev) => ({ step: Math.max(prev.step - 1, 0) }));
  	};

	startStep4 = () => {
		this.setState({ step: 4 });
	};

	goHome = () => {
		this.setState({ step: 0 });
	};

  	updateForm = (data) => {
    	this.setState(prev => ({
      		formData: { ...prev.formData, ...data },
    	}));
  	};

	renderStep = () => {
    	const { step, formData } = this.state;
		switch (step) {
      		case 0:
        		return (
					<MAIN
						onFindRoommate={this.startStep4}
						onLoginClick={this.startStep4}
						onGoHome={this.goHome}
					/>
				);
      		case 1:
        		return <Step1 data={formData} onNext={this.nextStep} onChange={this.updateForm} onGoHome={this.goHome} />;
      		case 2:
        		return <Step2 data={formData} onNext={this.nextStep} onBack={this.prevStep} onChange={this.updateForm} onGoHome={this.goHome} />;
      		case 3:
        		return <Step3 data={formData} onBack={this.prevStep} onGoHome={this.goHome} />;
      		case 4:
        		return <Card />;
			default:
        		return <MAIN onFindRoommate={this.startStep1} onLoginClick={this.startStep1} onGoHome={this.goHome} />;
    	}
	};

  	render() {
		return this.renderStep();
	}
}
