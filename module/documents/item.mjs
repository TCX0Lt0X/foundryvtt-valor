import {VALOR} from "../helpers/config.mjs";
import {technique} from "./items/technique.mjs";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class valorItem extends Item {


  static async create(data, options) {

    return await super.create(data, options);
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).

    super.prepareData();

      }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    const item = this;

  }

  /*
  Incomplete function do not consume
   */
  static async _prepareTechniqueData(technique) {
    //Compendium.world.techniques.YO5QaSzNzZpDyg6q
    //console.log(fromUuidSync(`Compendium.world.techniques.YO5QaSzNzZpDyg6q`));

    if (technique.system.core.uuid === null) {
      return;
    }

    //mocks
    const modd = [{name: "testMod", uuid: "Compendium.world.techniques.BqvtSWVmy5FX0c6W", level: 1}]
    const limito = [{name: "testMod", uuid: "Compendium.world.techniques.2MZFUp6yvuHpxqjC", level: 1}]
    technique.setFlag('valor', 'techMods', modd)
    technique.setFlag('valor', 'techLimits', limito)

    const core = await fromUuid(technique.system.core.uuid);
    const mods = [];
    const limits = [];
    for (const mod of technique.getFlag('valor', 'techMods')) {
      mods.push(await fromUuid(mod.uuid));
    }
    console.log(mods);

    for (const limit of technique.getFlag('valor', 'techLimits') ?? [] ) {
      limits.push(await fromUuid(limit.uuid));
    }

    if (core == null) {
      console.error(`core with id '${technique.system.core.uuid}' cannot be found`);
      return;
    }

    technique.system.core.name = core.name;
    technique.system.action = core.system.action;
    technique.system.cost.stamina.min = core.system.staminaCost.min;
    technique.system.target = core.system.target;
    technique.system.range= core.system.range;
    technique.system.area = core.system.area;
    technique.system.isUlt = core.system.isUlt;
    if (technique.system.isUlt === true) {
      technique.system.uses.max = 1
    }

    for (const mod of mods) {

    }

    for (const limit of limits) {

    }











    technique.system.cost.stamina.value = Math.max(
        core.system.staminaCost.base
        + ( core.system.staminaCost.perLevel
            * technique.system.level.techniqueLevel ),
        technique.system.cost.stamina.min );


  }


  static _prepareSkillFlawData(item) {
    //set max level based on actor level and progression speed
    if (!item.system.isEffect && item.isOwned) {
      item.system.level.max = Math.max(Math.ceil(item.parent.system.misc.level.value / VALOR.skills.progression[item.system.progression]), 1)

      //check levels are in valid range
      if (item.system.level.value > item.system.level.max) {
        item.system.level.value = item.system.level.max;
      }
    }
    if (item.system.level.value < 1) {
      item.system.level.value = 1;
    }

    //set sp value, and apply cost/bonus to actor if it is not a temporary effect (do to weaken/boost/transform core technique)
    item.system.sp.value = item.system.sp.base + (item.system.sp.levelUp * item.system.level.value);
    if (!item.system.isEffect && item.isOwned) {
      let skillPointTarget;
      if (item.type === 'flaw') {
        skillPointTarget = "system.misc.skillPoints.flawBonus";
      } else {
        skillPointTarget = "system.misc.skillPoints.spent";
      }
      const skillPointData = foundry.utils.getProperty(item.parent, skillPointTarget);

      const updateSkillPointData = {
        [item.name]: {
          itemId: item.id,
          value: item.system.sp.value
        }
      };

      Object.assign(skillPointData.modifiers, updateSkillPointData)
      Object.assign(skillPointData, {value: item.system.sp.value + skillPointData.value})

      foundry.utils.setProperty(item.parent, skillPointTarget, skillPointData);
    }

    //apply each modifier bonus, based on if condition is true
    if (item.system.isActive && item.isOwned) {
      for (const modifier of item.getFlag('valor','modifiers')) {
        if (modifier.targetData !== "") {
          let updates;
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
                    xy[i][j] = (foundry.utils.getProperty(item, xy[i][j]));
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
              const target = foundry.utils.getProperty(item.parent, `${modifier.targetData}`);
              let effectiveLevel;
              let baseLevel = 0;
              let boostLevel = 0;
              let itemId;
              let modifierTotal;
              let targetNewTotal;

              if(!item.system.isEffect) {
                baseLevel = item.system.level.value;
              } else {
                boostLevel = item.system.level.value;
              }

              if ((Object.keys(target.modifiers ?? {} )).includes(item.name)) {
                baseLevel = Math.max(baseLevel, target.modifiers[item.name].itemLvl.baseLevel);
                boostLevel = Math.max(boostLevel, target.modifiers[item.name].itemLvl.boostLevel);
                if(item.type === "flaw" && boostLevel >= 1) {
                  effectiveLevel = Math.max(baseLevel +1, boostLevel);
                } else {
                  effectiveLevel = baseLevel + boostLevel;
                }
                itemId = (target.modifiers[item.name].itemId);
                itemId.push(item.id);
                modifierTotal = modifier.base + (modifier.levelUp * effectiveLevel);
                const levelDelta = effectiveLevel - target.modifiers[item.name].itemLvl.effectiveLevel;
                targetNewTotal = (modifier.levelUp * levelDelta) + target.value;
              } else {
                itemId = [item.id];
                effectiveLevel = baseLevel + boostLevel;
                modifierTotal = modifier.base + (modifier.levelUp * effectiveLevel);
                targetNewTotal = modifierTotal + target.value;
              }

              const updateModifiers = {
                [item.name]: {
                  itemId: itemId,
                  itemType: item.type,
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
              foundry.utils.setProperty(item.parent, `${modifier.targetData}`, target);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }

  /**
   * @override
   * Augment the basic item data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an item
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const item = this;

    if(item.type === "technique") {
      valorItem._prepareTechniqueData(item);
    }
  }




  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
