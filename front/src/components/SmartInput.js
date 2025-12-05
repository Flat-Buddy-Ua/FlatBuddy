import React, { PureComponent } from 'react';

export class SmartInput extends PureComponent {
    state = {
        value: this.props.defaultValue || '',
        isFocused: false
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
        
        if (this.state.value === this.props.defaultValue) {
            this.setState({ value: '' });
        }
    };

    handleBlur = () => {
        this.setState({ isFocused: false });

        if (this.props.onBlur) {
            this.props.onBlur(event);
        }

        if (this.state.value === '') {
            this.setState({ value: this.props.defaultValue });
        }
    };

    handleChange = (event) => {
        this.setState({ value: event.target.value });
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    };

    render() {
        return (
            <input
                value={this.state.value}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                style={{
                    width: "100%",
                    height: "100%",
                    paddingLeft: "20px",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "16px",
                    fontFamily: "Inter",
                    color: "rgba(0, 0, 0, 1)"
                }}
            />
        );
    }
}