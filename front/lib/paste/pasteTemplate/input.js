const inputGenerator = (name) => {
    return `import React, { PureComponent } from 'react';
import { Input, Label, HelpText } from '@twilio-paste/core';

export class ${name} extends PureComponent {

  render() {
    return (
        <>
            {this.props.labelText && <Label required={this.props.required === 'true'}>{this.props.labelText}</Label>}
            <Input name="${name}" type="text" required={this.props.required === 'true'} hasError={this.props.state === 'Error'} value={this.props.inputText} />
            {this.props.helpText && <HelpText variant={this.props.state === 'Error' ? 'error' : 'default'}>{this.props.helpText}</HelpText>}
        </>
    )
  }
}

`
}

const composeInputCallingStr = (component, settings, print, indent) => {

    console.log(JSON.stringify(component), JSON.stringify(settings));

    let labelText;
    let inputText;
    let helpText;

    component.children.map((childElem) => {
        switch (childElem.name) {
            case 'Label':
                labelText = childElem.children[0].characters;
                break;
            case '⚙️ Field':
                inputText = childElem.children[0].children[0].children[0].characters;
                break;
            default:
                break;
        }
    });

    const attrs = settings.name.split(', ').reduce((prev, curr) => {
        const [_key, _val] = curr.split('=');
        return {
            ...prev,
            [_key]: _val
        };
    }, {});

    helpText = attrs['Help text'] === 'Yes' ? component.children[component.children.length - 1].children[attrs.State === 'Error' ? 1 : 0].characters : null;

    // let variant = attrs.Variant !== 'Link-style' ? String(attrs.Variant).toLowerCase() : 'link';
    // const size = attrs.Size !== 'Default' ? 'small' : null;
    // variant = attrs.Destructive === 'Yes' ? 'destructive_' + variant : variant;
    // const text = component.children[0].children[0].children[0].characters;

    print(`    <C${component.name.replace(/\W+/g, '')}`, indent);
    print(`      {...this.props}`, indent);
    print(`      nodeId="${component.id}"`, indent);
    print(`      state="${attrs.State}"`, indent);
    labelText && print(`      labelText="${labelText}"`, indent);
    inputText && print(`      inputText="${inputText}"`, indent);
    helpText && print(`      helpText="${helpText}"`, indent);
    attrs.Required === "Yes" ? print(` required="true"`, indent) : null;
    // print(`      variant="${variant}"`, indent);
    // print(`      text="${text}"`, indent);
    // size && print(`      size="${size}"`, indent);
    print(`    />`, indent);
}

module.exports = { inputGenerator, composeInputCallingStr }