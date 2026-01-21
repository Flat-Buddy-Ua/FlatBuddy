import React, { PureComponent } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
// import { Step3 } from "./Step3";

export class RegisterLayout extends PureComponent {
  	state = {
    	step: 1,
    	formData: {
      		email: "",
      		password: "",
      		name: "",
      		isON: false,
    	},
  	};
	
  	nextStep = () => {
    	this.setState(prev => ({ step: prev.step + 1 }));
  	};

  	prevStep = () => {
    	this.setState(prev => ({ step: prev.step - 1 }));
  	};

  	updateForm = (data) => {
    	this.setState(prev => ({
      		formData: { ...prev.formData, ...data },
    	}));
  	};

  	render() {
    	const { step, formData } = this.state;

    	switch (step) {
      		case 1:
        		return <Step1 data={formData} onNext={this.nextStep} onChange={this.updateForm} />;
      		case 2:
        		return <Step2 data={formData} onNext={this.nextStep} onBack={this.prevStep} onChange={this.updateForm} />;
      		// case 3:
        		// return <Step3 data={formData} onBack={this.prevStep} />;
      		default:
        		return null;
    	}
  	}
}
