import {VALOR} from "./helpers/config.mjs";


export const AsyncFunction = (async function() {}).constructor;

//takes a base attribute and returns the string name of the corresponding active attribtute
export function getActiveAttribute(baseAttribute) {
    const baseAttributes = Object.keys(VALOR.attributes.base);
    const activeAttributes = Object.keys(VALOR.attributes.active);
    const index = baseAttributes.indexOf(baseAttribute);
    return activeAttributes[index];
}

//takes an active attribute and returns the string name of the corresponding base attribute
export function getBaseAttribute(activeAttribute) {
    const baseAttributes = Object.keys(VALOR.attributes.base);
    const activeAttributes = Object.keys(VALOR.attributes.active);
    const index = activeAttributes.indexOf(activeAttribute);
    return baseAttributes[index];
}

//checks if a user is the GM with the least value id, for scenerios where
//code should fire only once from a single GM
export function isLeastGM() {

    if (!game.user.isGM) {
        return false;
    }

    const leastGM = game.users
        .filter(user => user.isGM && user.active);

    if (leastGM.length > 1) {
        return leastGM.some(otherGM => otherGM._id < game.user._id);
    } else {
        return true;
    }
}