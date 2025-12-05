const asToVariant = {
    h1: 'heading10',
    h2: 'heading20',
    h3: 'heading30',
    h4: 'heading40',
    h5: 'heading50',
}

const headingGenerator = (name) => {
    return `import React, { PureComponent } from 'react';
import { Heading } from '@twilio-paste/core';

export class ${name} extends PureComponent {

  render() {
    return (
        <Heading
          visible
          as={this.props.as}
          variant={this.props.variant}
        >
          {this.props.content}
        </Heading>
    )
  }
}

`
}

const composeHeadingCallingStr = (component, settings, print, indent) => {
    const attrs = settings.name.split(', ').reduce((prev, curr)=> {
        const [_key, _val] = curr.split('=');
        return {
            ...prev,
            [_key]: _val
        };
    }, {});
    let content = component.children[0];
    if (content) { content = content.characters; }
    print(`    <C${component.name.replace(/\W+/g, '')}`, indent);
    print(`      {...this.props}`, indent);
    print(`      nodeId="${component.id}"`, indent);
    print(`      as="${attrs.Variant.toLowerCase()}"`, indent);
    print(`      variant="${asToVariant[attrs.Variant.toLowerCase()]}"`, indent);
    print(`      content="${content}"`, indent);
    print(`    />`, indent);
}

module.exports = { headingGenerator, composeHeadingCallingStr }