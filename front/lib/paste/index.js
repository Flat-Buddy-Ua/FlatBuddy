const fs = require('fs');

const { comboBoxGenerator, composeComboboxCallingStr } = require('./pasteTemplate/comboBox');
const { buttonGenerator, composeButtonCallingStr } = require('./pasteTemplate/button');
const { inputGenerator, composeInputCallingStr } = require('./pasteTemplate/input');
const {headingGenerator, composeHeadingCallingStr} = require('./pasteTemplate/heading');
const {composeBreadcrumbCallingStr, breadcrumbGenerator} = require('./pasteTemplate/breadcrumb');

const propsList = {
    comboBox: ['state', 'helpText', 'label', 'suffix'],
    heading: ['as', 'variant', 'content'],
    breadcrumb: ['breadcrumbs']
}


const printPasteComponent = (component, settings, componentMap, print, indent) => {
    const name = 'C' + component.name.replace(/\W+/g, '');
    let convertFunc = null;
    let generateFunc = null;
    switch (component.name) {
        case '#PasteCombobox':
            convertFunc = composeComboboxCallingStr;
            generateFunc = comboBoxGenerator;
            break;
        case '#PasteButton':
            convertFunc = composeButtonCallingStr;
            generateFunc = buttonGenerator;
            break;
        case '#PasteInput':
            convertFunc = composeInputCallingStr;
            generateFunc = inputGenerator;
        case '#PasteHeading':
            convertFunc = composeHeadingCallingStr;
            generateFunc = headingGenerator;
            break;
        case '#PasteBreadcrumb':
            convertFunc = composeBreadcrumbCallingStr;
            generateFunc = breadcrumbGenerator;
            break;
        default:
            break;
    }
    if (convertFunc && generateFunc) {
        convertFunc(component, settings, print, indent);
    }

    const path = `src/components/${name}.js`;

    if (!fs.existsSync(path)) {
        const componentSrc = generateFunc(name);
        fs.writeFile(path, componentSrc, function(err) {
            if (err) console.log(err);
            console.log(`wrote ${path}`);
        });
    }
    componentMap[component.id] = {instance: null, name, doc: ''};
}

module.exports = {
    printPasteComponent
};
