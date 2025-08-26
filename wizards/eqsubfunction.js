import { getReference } from '../node_modules/@openenergytools/scl-lib/dist/tBaseElement/getReference.js';
import '../node_modules/@openenergytools/scl-lib/dist/generator/lnInstGenerator.js';
import '../node_modules/@openenergytools/scl-lib/dist/generator/macAddressGenerator.js';
import '../node_modules/@openenergytools/scl-lib/dist/generator/appIdGenerator.js';
import '../node_modules/@openenergytools/scl-lib/dist/tExtRef/extRefTypeRestrictions.js';
import '../node_modules/@openenergytools/scl-lib/dist/tDataTypeTemplates/nsdToJson.js';
import '../node_modules/@openenergytools/scl-lib/dist/tBaseElement/find.js';
import '../node_modules/@openenergytools/scl-lib/dist/tBaseElement/tags.js';
import { reservedNames, getValue, createElement } from '../foundation.js';
import { contentFunctionWizard } from './function.js';

function createEqSubFunctionAction(parent) {
    return (inputs) => {
        const attributes = {};
        const eqSubFunctionKeys = ['name', 'desc', 'type'];
        eqSubFunctionKeys.forEach(key => {
            attributes[key] = getValue(inputs.find(i => i.label === key));
        });
        const eqSubFunction = createElement(parent.ownerDocument, 'EqSubFunction', attributes);
        return [
            {
                parent,
                node: eqSubFunction,
                reference: getReference(parent, 'EqSubFunction'),
            },
        ];
    };
}
function createEqSubFunctionWizard(parent) {
    const name = '';
    const desc = null;
    const type = null;
    return {
        title: 'Add EqSubFunction',
        primary: {
            icon: 'save',
            label: 'save',
            action: createEqSubFunctionAction(parent),
        },
        content: [
            ...contentFunctionWizard({
                name,
                desc,
                type,
                reservedValues: reservedNames(parent, 'EqSubFunction'),
            }),
        ],
    };
}
function updateAction(element) {
    return (inputs) => {
        const attributes = {};
        const functionKeys = ['name', 'desc', 'type'];
        functionKeys.forEach(key => {
            attributes[key] = getValue(inputs.find(i => i.label === key));
        });
        if (functionKeys.some(key => attributes[key] !== element.getAttribute(key))) {
            return [{ element, attributes }];
        }
        return [];
    };
}
function editEqSubFunctionWizard(element) {
    const name = element.getAttribute('name');
    const desc = element.getAttribute('desc');
    const type = element.getAttribute('type');
    return {
        title: 'Edit EqSubFunction',
        primary: {
            icon: 'save',
            label: 'save',
            action: updateAction(element),
        },
        content: [
            ...contentFunctionWizard({
                name,
                desc,
                type,
                reservedValues: reservedNames(element),
            }),
        ],
    };
}

export { createEqSubFunctionWizard, editEqSubFunctionWizard };
//# sourceMappingURL=eqsubfunction.js.map
