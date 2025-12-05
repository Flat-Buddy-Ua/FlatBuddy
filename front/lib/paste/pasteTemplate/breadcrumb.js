const breadcrumbGenerator = (name) => {
    return `import React, { PureComponent } from 'react';
import { Breadcrumb, BreadcrumbItem, Flex, Text } from '@twilio-paste/core';

export class ${name} extends PureComponent {

  render() {
    return (
        <Breadcrumb>
            {this.props.breadcrumbs.map(str => (
                <BreadcrumbItem
                    key={str}
                    href={'/'}
                >
                    <Flex vAlignContent='center'>
                        <Text
                            as='span'
                            fontSize='fontSize20'
                            lineHeight='lineHeight20'
                            color='inherit'
                        >
                            {str}
                        </Text>
                    </Flex>
                </BreadcrumbItem>
            ))}
        </Breadcrumb>
    )
  }
}

`
}

const composeBreadcrumbCallingStr = (component, settings, print, indent) => {
    const attrs = settings.name.split(', ').reduce((prev, curr)=> {
        const [_key, _val] = curr.split('=');
        return {
            ...prev,
            [_key]: _val
        };
    }, {});
    let content = component.children.filter(comp => comp.name === '⚙️ Breadcrumb');
    const breadcrumbs = [];
    if (content) {
        content.forEach(comp => breadcrumbs.push(comp.children[0].characters));
    }
    print(`    <C${component.name.replace(/\W+/g, '')}`, indent);
    print(`      {...this.props}`, indent);
    print(`      nodeId="${component.id}"`, indent);
    print(`      breadcrumbs={${JSON.stringify(breadcrumbs)}}`, indent);
    print(`    />`, indent);
}

module.exports = { breadcrumbGenerator, composeBreadcrumbCallingStr }