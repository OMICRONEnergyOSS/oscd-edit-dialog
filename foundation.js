/** @returns the `value` or `maybeValue` of `input` depending on type. */
function getValue(input) {
    return input.value;
}
/** @returns a new [[`tag`]] element owned by [[`doc`]]. */
function createElement(doc, tag, attrs) {
    const element = doc.createElementNS(doc.documentElement.namespaceURI, tag);
    Object.entries(attrs)
        .filter(([_, value]) => value !== null)
        .forEach(([name, value]) => element.setAttribute(name, value));
    return element;
}
function getChildElementsByTagName(parent, tag) {
    if (!parent || !tag) {
        return [];
    }
    return Array.from(parent.children).filter(element => element.tagName === tag);
}
/** @returns reserved siblings names attributes */
function reservedNames(element, tagName) {
    if (tagName) {
        return getChildElementsByTagName(element, tagName).map(sibling => sibling.getAttribute('name'));
    }
    if (!element.parentElement) {
        return [];
    }
    return getChildElementsByTagName(element.parentElement, element.tagName)
        .filter(sibling => sibling !== element)
        .map(sibling => sibling.getAttribute('name'));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSclTextfield(type) {
    return 'value' in type && 'multiplier' in type;
}
/** @returns the `multiplier` of `input` if available. */
function getMultiplier(input) {
    if (isSclTextfield(input)) {
        return input.multiplier;
    }
    return null;
}
/** @returns a clone of `element` with attributes set to values from `attrs`. */
function cloneElement(element, attrs) {
    const newElement = element.cloneNode(false);
    Object.entries(attrs).forEach(([name, value]) => {
        if (value === null) {
            newElement.removeAttribute(name);
        }
        else {
            newElement.setAttribute(name, value);
        }
    });
    return newElement;
}
/** @returns the cartesian product of `arrays` */
function crossProduct(...arrays) {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);
}
/** Whether `P` element is required within `Address` */
const typeNullable = {
    IP: false,
    'IP-SUBNET': false,
    'IP-GATEWAY': true,
    'OSI-TSEL': true,
    'OSI-SSEL': true,
    'OSI-PSEL': true,
    'OSI-AP-Title': true,
    'OSI-AP-Invoke': true,
    'OSI-AE-Qualifier': true,
    'OSI-AE-Invoke': true,
    'OSI-NSAP': true,
    'MAC-Address': false,
    APPID: false,
    'VLAN-ID': true,
    'VLAN-PRIORITY': true,
    'SNTP-Port': true,
    'MMS-Port': true,
    DNSName: true,
    'UDP-Port': true,
    'TCP-Port': true,
    'C37-118-IP-Port': true,
    IPv6: true,
    'IPv6-SUBNET': true,
    'IPv6-GATEWAY': true,
    IPv6FlowLabel: true,
    IPv6ClassOfTraffic: true,
    'IPv6-IGMPv3Src': true,
    'IP-IGMPv3Sr': true,
    'IP-ClassOfTraffic': true,
};
function getTypes(element) {
    if (!element.ownerDocument.documentElement) {
        return [];
    }
    const pTypes2003 = [
        'IP',
        'IP-SUBNET',
        'IP-GATEWAY',
        'OSI-TSEL',
        'OSI-SSEL',
        'OSI-PSEL',
        'OSI-AP-Title',
        'OSI-AP-Invoke',
        'OSI-AE-Qualifier',
        'OSI-AE-Invoke',
        'OSI-NSAP',
        'VLAN-ID',
        'VLAN-PRIORITY',
    ];
    const pTypes2007B = [
        ...pTypes2003,
        'SNTP-Port',
        'MMS-Port',
        'DNSName',
        'UDP-Port',
        'TCP-Port',
        'C37-118-IP-Port',
    ];
    const pTypes2007B4 = [
        ...pTypes2007B,
        'IPv6',
        'IPv6-SUBNET',
        'IPv6-GATEWAY',
        'IPv6FlowLabel',
        'IPv6ClassOfTraffic',
        'IPv6-IGMPv3Src',
        'IP-IGMPv3Sr',
        'IP-ClassOfTraffic',
    ];
    const scl = element.ownerDocument.documentElement;
    const type = (scl.getAttribute('version') ?? '2003') +
        (scl.getAttribute('revision') ?? '') +
        (scl.getAttribute('release') ?? '');
    if (type === '2003') {
        return pTypes2003;
    }
    if (type === '2007B') {
        return pTypes2007B;
    }
    return pTypes2007B4;
}
/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
function compareNames(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
    }
    if (typeof a === 'object' && typeof b === 'string') {
        return (a.getAttribute('name') ?? '').localeCompare(b);
    }
    if (typeof a === 'string' && typeof b === 'object') {
        return a.localeCompare(b.getAttribute('name'));
    }
    if (typeof a === 'object' && typeof b === 'object') {
        return (a.getAttribute('name') ?? '').localeCompare(b.getAttribute('name') ?? '');
    }
    return 0;
}

export { cloneElement, compareNames, createElement, crossProduct, getChildElementsByTagName, getMultiplier, getTypes, getValue, isSclTextfield, reservedNames, typeNullable };
//# sourceMappingURL=foundation.js.map
