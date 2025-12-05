const comboBoxGenerator = (name) => {
    return `import React, { PureComponent } from 'react';
import { Combobox } from '@twilio-paste/core';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

export class ${name} extends PureComponent {

  render() {
    return (
        <Combobox
            items={['option 1', 'option 2']}
            labelText={this.props.label}
            helpText={this.props.helpText}
            disabled={this.props.state === 'Disabled'}
            hasError={this.props.state === 'Error'}
            insertAfter={this.props.suffix === 'true' && <SearchIcon decorative={false} title='search' />}
        />
    )
  }
}

`
}

const composeComboboxCallingStr = (component, settings, print, indent) => {
    const attrs = settings.name.split(', ').reduce((prev, curr)=> {
        const [_key, _val] = curr.split('=');
        return {
            ...prev,
            [_key]: _val
        };
    }, {});
    let helpText = (component.children.find(comp => comp.name === 'Help text'));
    if (helpText) { helpText = helpText.children.find(comp => comp.name === '✏️ Help text' || comp.name === '✏️ Error text'); }
    if (helpText) { helpText = helpText.characters; }
    const label = (component.children.find(comp => comp.name === 'Label')).children[0].characters;
    print(`    <C${component.name.replace(/\W+/g, '')}`, indent);
    print(`      {...this.props}`, indent);
    print(`      nodeId="${component.id}"`, indent);
    print(`      state="${attrs.State}"`, indent);
    helpText && print(`      helpText="${helpText}"`, indent);
    print(`      label="${label}"`, indent);
    print(`      suffix="${attrs['Prefix/Suffix'] === 'Suffix icon'}"`, indent);
    print(`    />`, indent);
}

module.exports = { comboBoxGenerator, composeComboboxCallingStr }