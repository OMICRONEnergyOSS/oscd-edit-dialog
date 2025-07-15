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

function createAction(parent) {
    return (inputs) => {
        const attributes = {};
        const eqFunctionKeys = ['name', 'desc', 'type'];
        eqFunctionKeys.forEach(key => {
            attributes[key] = getValue(inputs.find(i => i.label === key));
        });
        const eqFunction = createElement(parent.ownerDocument, 'EqFunction', attributes);
        return [
            {
                parent,
                node: eqFunction,
                reference: getReference(parent, 'EqFunction'),
            },
        ];
    };
}
function createEqFunctionWizard(parent) {
    const name = '';
    const desc = null;
    const type = null;
    return {
        title: 'Add EqFunction',
        primary: {
            icon: 'save',
            label: 'save',
            action: createAction(parent),
        },
        content: [
            ...contentFunctionWizard({
                name,
                desc,
                type,
                reservedValues: reservedNames(parent, 'EqFunction'),
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
function editEqFunctionWizard(element) {
    const name = element.getAttribute('name');
    const desc = element.getAttribute('desc');
    const type = element.getAttribute('type');
    return {
        title: 'Edit EqFunction',
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

export { createEqFunctionWizard, editEqFunctionWizard };
//# sourceMappingURL=eqfunction.js.map
