import {AsyncFunction, getActiveAttribute, isLeastGM} from "../../utils.mjs";

/**
 * runs script on a techOpt which is applied to technique, from a single
 * Gamemaster client, to avoid script running from multiple clients
 *
 * @param {valorItem} technique
 * @param {object} techOpt
 * @returns {Promise<void>}
 * @private
 */
export async function _runCompendiumTechScript(technique, techOpt) {
    if(!game.user.isGM) return;
    if(!isLeastGM()) return;

    if (await fromUuid(`Compendium.valor.techniques.${techOpt._id}`) == null) return;

    const TechFn = new AsyncFunction("technique", techOpt.type, techOpt.system.scripts.prepScript);
    try {
        await TechFn.call(this, technique, techOpt);
    } catch(err) {
        ui.notifications.error(`TECHNIQUE.${(techOpt.type).toUpperCase()}SCRIPT.Error`, { localize: false });
    }
}

/**
 * calculate technique data by pulling its cores, modifiers, and
 * limits from Compendium
 * @param {valorItem} technique
 * @returns {Promise<void>}
 * @private
 */
export async function _prepareTechniqueData(technique) {

    const leastGM = isLeastGM();
    const techComp = game.packs.get("valor.techniques");

    //defaults core to first core in Compendium if no core has been set
    if (technique.system.core.uuid === "") {
        const defaultCore = ((techComp.index).filter(function (opt) {
            return opt.type === "core";
        }))[0];
        technique.system.core.name = defaultCore.name;
        technique.system.core._id = defaultCore._id;
        technique.system.core.uuid = defaultCore.uuid;
    }

    //fetch core from Compendium
    let core = techComp.get(technique.system.core._id);
    if (core == null) {
        core = await fromUuid(technique.system.core.uuid);
        if (core == null) {
            ui.notifications.error("TECHNIQUE.CORE.Error", { localize: false });
            return;
        }
    }
    core = core.toObject(false);

    //fetch mods from compendium
    const mods = technique.flags.valor?.technique?.modifier ?? {};
    for (const mod in mods) {
        let retrievedMod = techComp.get(mods[mod]._id);
        if (retrievedMod == null) {
            retrievedMod = await fromUuid(mods[mod].uuid);
        }
        retrievedMod = retrievedMod.toObject(false);
        foundry.utils.setProperty(retrievedMod, "system.level", mods[mod].level);
        foundry.utils.setProperty(technique, `system.mods.${mod}`, retrievedMod);
    }

    //fetch limits from compendium
    const limits = technique.flags.valor?.technique?.limit ?? {};
    for (const limit in limits ) {

        let retrievedLimit = techComp.get(limits[limit]._id);
        if (retrievedLimit == null) {
            retrievedLimit = await fromUuid(limits[limit].uuid);
        }
        retrievedLimit = retrievedLimit.toObject(false);
        foundry.utils.setProperty(retrievedLimit, "system.level", limits[limit].level);
        foundry.utils.setProperty(technique, `system.limits.${limit}`, retrievedLimit);
    }

    //confirms a selected base Attribute is valid and gets active Attribute
    if (!core.system.applicableAttributes[technique.system.attribute.effect]) {
        technique.system.attribute.effect = Object.keys(core.system.applicableAttributes).find(key => core.system.applicableAttributes[key]);
        //technique.update({'system.attribute.effect': Object.keys(core.system.applicableAttributes).find(key => core.system.applicableAttributes[key])});
    }
    technique.system.attribute.opposedRoll = getActiveAttribute(technique.system.attribute.effect);

    //apply core data
    technique.system.core.flags = core.flags;
    technique.system.core.system = core.system;
    technique.system.action = core.system.action;
    technique.system.cost.stamina.min = core.system.staminaCost.min;
    technique.system.targets = core.system.targets;
    technique.system.range = core.system.range;
    technique.system.area = core.system.area;
    technique.system.isUlt = core.system.isUlt;
    technique.system.text.flavor.default = core.system.text.flavor.default;
    technique.system.text.crunch.effect = core.system.text.template.effect;
    technique.system.text.crunch.special = core.system.text.template.special;
    technique.system.text.crunch.formatStrings = core.flags.valor?.formatStrings ?? {};

    if (technique.system.isUlt === true) {
        technique.system.uses.max = 1;
    }

    //run core prepScript
    const coreFn = new AsyncFunction( "isLeastGM", "technique", "core", core.system.scripts.prepScript);
    try {
        coreFn.call(this, leastGM, technique, core);
    } catch(err) {
        ui.notifications.error("TECHNIQUE.CORESCRIPT.Error", { localize: false });
    }

    //process modifiers
    let effectiveModLevel = 0;
    for (const mod in technique.system.mods) {

        //apply mod effective technique level cost
        effectiveModLevel +=
            technique.system.mods[mod].system.techniqueLevelModifier.base +
            ((technique.system.mods[mod].system.level-1) * technique.system.mods[mod].system.techniqueLevelModifier.perLevel);

        //grab paths to relevant data for string formating
        technique.system.text.crunch.effect += technique.system.mods[mod].system.text.template.effect;
        technique.system.text.crunch.special += technique.system.mods[mod].system.text.template.special;
        technique.system.text.crunch.formatStrings = Object.assign({}, technique.system.text.crunch.formatStrings, technique.system.mods[mod].flags.valor?.formatStrings ?? {});

        //run modifier prep script
        const modFn = new AsyncFunction("isLeastGM", "technique", "modifier", technique.system.mods[mod].system.scripts.prepScript);
        try {
            modFn.call(this, leastGM, technique, technique.system.mods[mod]);
        } catch(err) {
            ui.notifications.error("TECHNIQUE.MODSCRIPT.Error", { localize: false });
        }
    }
    technique.system.level.effectiveModLevel = effectiveModLevel;

    //process limits
    let costReduction = 0;
    for (const limit in technique.system.limits) {

        //apply limit stamina cost reduction
        costReduction +=
            technique.system.limits[limit].system.costReduction.base +
            ((technique.system.limits[limit].system.level-1) * technique.system.limits[limit].system.costReduction.perLevel);

        //grab paths to relevant data for string formating
        technique.system.text.crunch.effect += technique.system.limits[limit].system.text.template.effect;
        technique.system.text.crunch.special += technique.system.limits[limit].system.text.template.special;
        technique.system.text.crunch.formatStrings = Object.assign({}, technique.system.text.crunch.formatStrings, technique.system.limits[limit].flags.valor?.formatStrings ?? {});
        console.log(limits[limit]);
        //run limit prep script
        const limitFn = new AsyncFunction("isLeastGM", "technique", "limit", technique.system.limits[limit].system.scripts.prepScript);
        try {
            limitFn.call(this, leastGM, technique, technique.system.limits[limit]);
        } catch(err) {
            ui.notifications.error("TECHNIQUE.LIMITSCRIPT.Error", { localize: false });
        }
    }

    technique.system.cost.stamina.limitReduction = costReduction;

    //calculate final Technique Level
    technique.system.level.techniqueLevel =
        technique.system.level.coreLevel +
        technique.system.level.effectiveModLevel;

    technique.parent.system.misc.techniquePoints.spent.value += technique.system.level.techniqueLevel;

    //calculate final stamina cost
    technique.system.cost.stamina.value = Math.max(
        core.system.staminaCost.base +
        ( core.system.staminaCost.perLevel * technique.system.level.techniqueLevel ) -
        technique.system.cost.stamina.limitReduction,
        technique.system.cost.stamina.min );

    //fetch values of properties for effect text formatting
    for (const formatString in technique.system.text.crunch.formatStrings) {
        technique.system.text.crunch.formatStrings[formatString] =
            foundry.utils.getProperty(technique, technique.system.text.crunch.formatStrings[formatString]);
    }
    technique.system.text.crunch.effect = game.i18n.format(`${technique.system.text.crunch.effect}`, technique.system.text.crunch.formatStrings);
    //technique.system.text.crunch.special = game.i18n.format(`${technique.system.text.crunch.special}`, technique.system.text.crunch.formatStrings);


    if (technique?._sheet?._state !== null && technique?._sheet?._state >= 0 ) {
        technique.sheet.render(true);
    }
}



