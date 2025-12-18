import { getReference } from '../node_modules/@openscd/scl-lib/dist/tBaseElement/getReference.js';
import '../node_modules/@openscd/scl-lib/dist/generator/lnInstGenerator.js';
import '../node_modules/@openscd/scl-lib/dist/generator/macAddressGenerator.js';
import '../node_modules/@openscd/scl-lib/dist/generator/appIdGenerator.js';
import '../node_modules/@openscd/scl-lib/dist/tExtRef/extRefTypeRestrictions.js';
import '../node_modules/@openscd/scl-lib/dist/tDataTypeTemplates/nsdToJson.js';
import '../node_modules/@openscd/scl-lib/dist/tBaseElement/find.js';
import '../node_modules/@openscd/scl-lib/dist/tBaseElement/tags.js';
import { reservedNames, getValue, createElement } from '../foundation.js';
import { contentFunctionWizard } from './function.js';

function createAction(parent) {
    return (inputs) => {
        const attributes = {};
        const subFunctionKeys = ['name', 'desc', 'type'];
        subFunctionKeys.forEach(key => {
            attributes[key] = getValue(inputs.find(i => i.label === key));
        });
        const subFunction = createElement(parent.ownerDocument, 'SubFunction', attributes);
        return [
            {
                parent,
                node: subFunction,
                reference: getReference(parent, 'SubFunction'),
            },
        ];
    };
}
function createSubFunctionWizard(parent) {
    const name = '';
    const desc = null;
    const type = null;
    return {
        title: 'Add SubFunction',
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
                reservedValues: reservedNames(parent, 'SubFunction'),
            }),
        ],
    };
}
function updateAction(element) {
    return (inputs) => {
        const attributes = {};
        const subFunctionKeys = ['name', 'desc', 'type'];
        subFunctionKeys.forEach(key => {
            attributes[key] = getValue(inputs.find(i => i.label === key));
        });
        if (subFunctionKeys.some(key => attributes[key] !== element.getAttribute(key))) {
            return [{ element, attributes }];
        }
        return [];
    };
}
function editSubFunctionWizard(element) {
    const name = element.getAttribute('name');
    const desc = element.getAttribute('desc');
    const type = element.getAttribute('type');
    return {
        title: 'Edit SubFunction',
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

export { createSubFunctionWizard, editSubFunctionWizard };
//# sourceMappingURL=subfunction.js.map
