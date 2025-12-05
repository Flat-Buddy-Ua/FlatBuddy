const buttonGenerator = (name) => {
    return `import React, { PureComponent } from 'react';
import { Button } from '@twilio-paste/core';

export class ${name} extends PureComponent {

  render() {
    return (
        <Button
            variant={this.props.variant} 
            disabled={this.props.state === 'Disabled'}
            size={this.props.size}
        >{this.props.text}</Button>
    )
  }
}

`
}

const composeButtonCallingStr = (component, settings, print, indent) => {

    const attrs = settings.name.split(', ').reduce((prev, curr) => {
        const [_key, _val] = curr.split('=');
        return {
            ...prev,
            [_key]: _val
        };
    }, {});

    let variant = attrs.Variant !== 'Link-style' ? String(attrs.Variant).toLowerCase() : 'link';
    const size = attrs.Size !== 'Default' ? 'small' : null;
    variant = attrs.Destructive === 'Yes' ? 'destructive_' + variant : variant;
    const text = component.children[0].children[0].children[0].characters;

    print(`    <C${component.name.replace(/\W+/g, '')}`, indent);
    print(`      {...this.props}`, indent);
    print(`      nodeId="${component.id}"`, indent);
    print(`      state="${attrs.State}"`, indent);
    print(`      variant="${variant}"`, indent);
    print(`      text="${text}"`, indent);
    size && print(`      size="${size}"`, indent);
    print(`    />`, indent);
}

module.exports = { buttonGenerator, composeButtonCallingStr }