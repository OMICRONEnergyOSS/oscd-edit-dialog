import { getValue } from '../foundation.js';
import { contentAddress, updateAddress } from './address.js';

function updateAction(element) {
    return (inputs, wizard) => {
        const action = [];
        const instType = wizard.querySelector('#instType').value === 'true';
        const addressContent = {};
        addressContent['MAC-Address'] = getValue(inputs.find(i => i.label === 'MAC-Address'));
        addressContent.APPID = getValue(inputs.find(i => i.label === 'APPID'));
        addressContent['VLAN-ID'] = getValue(inputs.find(i => i.label === 'VLAN-ID'));
        addressContent['VLAN-PRIORITY'] = getValue(inputs.find(i => i.label === 'VLAN-PRIORITY'));
        const addressActions = updateAddress(element, addressContent, instType);
        if (!addressActions.length) {
            return [];
        }
        addressActions.forEach(addressAction => {
            action.push(addressAction);
        });
        return [action];
    };
}
function editSMvWizard(element) {
    const types = ['MAC-Address', 'APPID', 'VLAN-ID', 'VLAN-PRIORITY'];
    return {
        title: 'Edit SMV',
        primary: {
            label: 'save',
            icon: 'edit',
            action: updateAction(element),
        },
        content: [...contentAddress({ element, types })],
    };
}

export { editSMvWizard };
//# sourceMappingURL=smv.js.map
