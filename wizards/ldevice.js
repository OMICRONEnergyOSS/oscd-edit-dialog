import '../node_modules/@lit/reactive-element/reactive-element.js';
import { html as x } from '../node_modules/lit-html/lit-html.js';
import '../node_modules/lit-element/lit-element.js';

function render(inst, name, ldNames) {
    return [
        x `<scl-text-field
      label="inst"
      .value=${inst}
      disabled
    ></scl-text-field>`,
        x `<scl-text-field
      label="name"
      .value=${name}
      nullable
      .reservedValues=${ldNames}
    ></scl-text-field>`,
    ];
}
function updateAction(element) {
    return (inputs) => {
        const name = inputs.find(i => i.label === 'name').value;
        if (name === element.getAttribute('name')) {
            return [];
        }
        return [
            {
                element,
                attributes: { name },
            },
        ];
    };
}
function editLDeviceWizard(element) {
    const ldNames = Array.from(element.ownerDocument.querySelectorAll(':root > IED > AccessPoint > Server > LDevice')).map(ied => ied.getAttribute('name'));
    return {
        title: 'Edit LDevice',
        primary: {
            icon: 'edit',
            label: 'save',
            action: updateAction(element),
        },
        content: render(element.getAttribute('inst') ?? '', element.getAttribute('name'), ldNames),
    };
}

export { editLDeviceWizard, updateAction };
//# sourceMappingURL=ldevice.js.map
