import {AsyncFunction, isLeastGM} from "../../utils.mjs";

export async function _runCompendiumTechScript(technique, item) {
    if(!game.user.isGM) return;
    if(!isLeastGM()) return;

    if ((await fromUuid(`Compendium.valor.techniques.${item._id}`) == null &&
        await fromUuid(`Compendium.world.techniques.${item._id}`) == null)) return;

    const TechFn = new AsyncFunction("technique", item.type, item.system.scripts.prepScript);
    try {
        await TechFn.call(this, technique, item);
    } catch(err) {
        ui.notifications.error(`TECHNIQUE.${(item.type).toUpperCase()}SCRIPT.Error`, { localize: false });
    }
}



