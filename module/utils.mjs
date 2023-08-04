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

export async function onTechOptChange(_id, technique) {

    if (_id == -1) return;

    const techComp = game.packs.get("valor.techniques");
    const techOpt = (techComp.index).get(_id);

    technique.setFlag('valor',`technique.${techOpt.type}.${_id}`,
        {
            "name": techOpt.name,
            "_id": techOpt._id,
            "uuid": techOpt.uuid,
            "level": 1
        });
}

export function onTechOptDelete(_id, technique) {

    if (_id == -1) return;

    const techComp = game.packs.get("valor.techniques");
    const techOpt = (techComp.index).get(_id);

    technique.unsetFlag('valor',`technique.${techOpt.type}.${_id}`);
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

//checks if parent of child has itself a parent
export function updateGrandParent(child) {
    if (child.parent?.parent !== null) {
        (child.parent.parent).reset();
    }
}