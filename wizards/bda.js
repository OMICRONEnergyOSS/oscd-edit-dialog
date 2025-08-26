import '../node_modules/@openenergytools/scl-lib/dist/tBaseElement/tags.js';
import '../node_modules/@openenergytools/scl-lib/dist/generator/lnInstGenerator.js';
import '../node_modules/@openenergytools/scl-lib/dist/generator/macAddressGenerator.js';
import '../node_modules/@openenergytools/scl-lib/dist/generator/appIdGenerator.js';
import '../node_modules/@openenergytools/scl-lib/dist/tExtRef/extRefTypeRestrictions.js';
import '../node_modules/@openenergytools/scl-lib/dist/tDataTypeTemplates/nsdToJson.js';
import '../node_modules/@openenergytools/scl-lib/dist/tBaseElement/find.js';
import { getValue } from '../foundation.js';
import { renderAbstractDataAttributeContent, getValAction } from './abstractda.js';

function updateBDaAction(element) {
    return (inputs) => {
        const name = getValue(inputs.find(i => i.label === 'name'));
        const desc = getValue(inputs.find(i => i.label === 'desc'));
        const bType = getValue(inputs.find(i => i.label === 'bType'));
        const type = bType === 'Enum' || bType === 'Struct'
            ? getValue(inputs.find(i => i.label === 'type'))
            : null;
        const sAddr = getValue(inputs.find(i => i.label === 'sAddr'));
        const valKind = getValue(inputs.find(i => i.label === 'valKind'));
        const valImport = getValue(inputs.find(i => i.label === 'valImport'));
        const valField = inputs.find(i => i.label === 'Val' && i.style.display !== 'none');
        const Val = valField ? getValue(valField) : null;
        let bdaAction;
        const valAction = [];
        if (name === element.getAttribute('name') &&
            desc === element.getAttribute('desc') &&
            bType === element.getAttribute('bType') &&
            type === element.getAttribute('type') &&
            sAddr === element.getAttribute('sAddr') &&
            valKind === element.getAttribute('valKind') &&
            valImport === element.getAttribute('valImprot')) {
            bdaAction = null;
        }
        else {
            bdaAction = {
                element,
                attributes: {
                    name,
                    desc,
                    bType,
                    type,
                    sAddr,
                    valKind,
                    valImport,
                },
            };
        }
        if (Val !== (element.querySelector('Val')?.textContent?.trim() ?? null)) {
            valAction.push(getValAction(element.querySelector('Val'), Val, bdaAction?.element ?? element));
        }
        const actions = [];
        if (bdaAction) {
            actions.push(bdaAction);
        }
        if (valAction) {
            actions.push(...valAction);
        }
        return actions;
    };
}
function editBDaWizard(element) {
    const doc = element.ownerDocument;
    const type = element.getAttribute('type');
    const name = element.getAttribute('name');
    const desc = element.getAttribute('desc');
    const bType = element.getAttribute('bType') ?? '';
    const sAddr = element.getAttribute('sAddr');
    const Val = element.querySelector('Val')?.innerHTML.trim() ?? null;
    const valKind = element.getAttribute('valKind');
    const valImport = element.getAttribute('valImport');
    const daOrEnumTypes = Array.from(doc.querySelectorAll('DAType, EnumType')).filter(daOrEnumType => daOrEnumType.getAttribute('id'));
    const data = element.closest('DataTypeTemplates');
    return {
        title: 'Edit BDA',
        primary: {
            icon: '',
            label: 'save',
            action: updateBDaAction(element),
        },
        content: [
            ...renderAbstractDataAttributeContent(name, desc, bType, daOrEnumTypes, type, sAddr, valKind, valImport, Val, data),
        ],
    };
}

export { editBDaWizard };
//# sourceMappingURL=bda.js.map
