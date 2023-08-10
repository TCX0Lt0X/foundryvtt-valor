import {VALOR} from "../../helpers/config.mjs";

/**
 * calculates and applies skill or flaw data to actor
 * to parent actor.
 * @param {valorItem} skillFlaw
 * @private
 */
export function _prepareSkillFlawData(skillFlaw) {
    //set max level based on actor level and progression speed
    if (!skillFlaw.system.isEffect && skillFlaw.isOwned) {
        skillFlaw.system.level.max = Math.max(Math.ceil(skillFlaw.parent.system.misc.level.value / VALOR.skills.progression[skillFlaw.system.progression]), 1)

        //check levels are in valid range
        if (skillFlaw.system.level.value > skillFlaw.system.level.max) {
            skillFlaw.system.level.value = skillFlaw.system.level.max;
        }
    }
    if (skillFlaw.system.level.value < 1) {
        skillFlaw.system.level.value = 1;
    }

    //set sp value, and apply cost/bonus to actor if it is not a temporary effect (do to weaken/boost/transform core technique)
    skillFlaw.system.sp.value = skillFlaw.system.sp.base + (skillFlaw.system.sp.levelUp * (skillFlaw.system.level.value-1));
    if (!skillFlaw.system.isEffect && skillFlaw.isOwned) {
        let skillPointTarget;
        if (skillFlaw.type === 'flaw') {
            skillPointTarget = "system.misc.skillPoints.flawBonus";
        } else {
            skillPointTarget = "system.misc.skillPoints.spent";
        }
        const skillPointData = foundry.utils.getProperty(skillFlaw.parent, skillPointTarget);

        const updateSkillPointData = {
            [skillFlaw.name]: {
                itemId: skillFlaw.id,
                value: skillFlaw.system.sp.value
            }
        };

        Object.assign(skillPointData.modifiers, updateSkillPointData)
        Object.assign(skillPointData, {value: skillFlaw.system.sp.value + skillPointData.value})

        foundry.utils.setProperty(skillFlaw.parent, skillPointTarget, skillPointData);
    }

    //apply each modifier bonus, based on if condition is true
    if (skillFlaw.system.isActive && skillFlaw.isOwned) {
        for (const modifier of skillFlaw.getFlag('valor','modifiers') ?? []) {
            if (modifier.targetData !== "") {
                try {
                    let condition;

                    //takes condition strings and splits each into substrings, to allow for basic arithmetic
                    let xy = [modifier.condition.x.split(" "), modifier.condition.y.split(" ")];

                    //if first condition string starts with true then condition checking will be skipped
                    if (xy[0][0].toLowerCase() === "true") {
                        condition = true;
                    } else {
                        //each substring is checked to see if it is a data variable path, grabbing the property if it is.
                        for (let i = 0; i < xy.length; i++) {
                            for (let j = 0; j < xy[i].length; j++) {
                                if (!(/[0-9`%^*+\-=\\]/.test(xy[i][j]))) {
                                    xy[i][j] = (foundry.utils.getProperty(skillFlaw, xy[i][j]));
                                }
                            }
                        }

                        //runs final substrings through an anonymous function to execute the joined string as code, for determining total of equation
                        const x = Function(`"use strict"; return ${(xy[0].toString()).replaceAll(",", "")};`)();
                        const y = Function(`"use strict"; return ${(xy[1].toString()).replaceAll(",", "")};`)();

                        //checks what kind of comparison operation is to be performed between the two conditions, and checks truth value
                        switch (modifier.condition.operator) {
                            case "==":
                                condition = x === y;
                                break;
                            case "!=":
                                condition = x !== y;
                                break;
                            case "<=":
                                condition = x <= y;
                                break;
                            case "<":
                                condition = x < y;
                                break;
                            case ">=":
                                condition = x >= y;
                                break;
                            case ">":
                                condition = x > y;
                                break;
                            default:
                                condition = false;
                        }
                    }
                    //applies modifier if condition is true
                    if (condition) {
                        const target = foundry.utils.getProperty(skillFlaw.parent, `${modifier.targetData}`);
                        let effectiveLevel;
                        let baseLevel = 0;
                        let boostLevel = 0;
                        let itemId;
                        let modifierTotal;
                        let targetNewTotal;

                        if(!skillFlaw.system.isEffect) {
                            baseLevel = skillFlaw.system.level.value;
                        } else {
                            boostLevel = skillFlaw.system.level.value;
                        }

                        if ((Object.keys(target.modifiers ?? {} )).includes(skillFlaw.name)) {
                            baseLevel = Math.max(baseLevel, target.modifiers[skillFlaw.name].itemLvl.baseLevel);
                            boostLevel = Math.max(boostLevel, target.modifiers[skillFlaw.name].itemLvl.boostLevel);
                            if(skillFlaw.type === "flaw" && boostLevel >= 1) {
                                effectiveLevel = Math.max(baseLevel +1, boostLevel);
                            } else {
                                effectiveLevel = baseLevel + boostLevel;
                            }
                            itemId = (target.modifiers[skillFlaw.name].itemId);
                            itemId.push(skillFlaw.id);
                            modifierTotal = modifier.base + (modifier.levelUp * effectiveLevel);
                            const levelDelta = effectiveLevel - target.modifiers[skillFlaw.name].itemLvl.effectiveLevel;
                            targetNewTotal = (modifier.levelUp * levelDelta) + target.value;
                        } else {
                            itemId = [skillFlaw.id];
                            effectiveLevel = baseLevel + boostLevel;
                            modifierTotal = modifier.base + (modifier.levelUp * effectiveLevel);
                            targetNewTotal = modifierTotal + target.value;
                        }

                        const updateModifiers = {
                            [skillFlaw.name]: {
                                itemId: itemId,
                                itemType: skillFlaw.type,
                                itemLvl: {
                                    effectiveLevel: effectiveLevel,
                                    baseLevel: baseLevel,
                                    boostLevel: boostLevel
                                },
                                value: modifierTotal
                            }
                        };
                        Object.assign(target.modifiers, updateModifiers);
                        Object.assign(target, {value: targetNewTotal});
                        foundry.utils.setProperty(skillFlaw.parent, `${modifier.targetData}`, target);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}