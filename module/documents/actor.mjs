import { VALOR } from "../helpers/config.mjs"
import {valorItem as Item} from "./item.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class valorActor extends Actor {


  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    const actor = this;

    actor._prepareCharacterData(actor);
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actor = this;
    
    actor._prepareDerivedData(actor);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actor) {
    if (actor.type !== 'character') return;

    // Make modifications to data here. For example:
    const characterType = actor.getCharacterType(actor)

    actor.calculateExperience(actor, characterType);
    actor.calculateSeason(actor);
    actor.calculateAttributePoints(actor);
    actor.calculateSkillPoints(actor, characterType);
    
    actor.calculateDamageIncrement(actor, characterType);
    actor.calculateZoneOfControl(actor, characterType);
    actor.calculateSize(actor, characterType);
    actor.calculateValor(actor, characterType);
    actor.calculateUltimateTechniques(actor, characterType);
  }

  _prepareDerivedData(actor){
    const characterType = actor.getCharacterType(actor);

    const items = actor.itemTypes;

    for (const item of items["flaw"]) {
      Item._prepareSkillFlawData(item);
      actor.calculateIncrements(actor)
    }
    for (const item of items["skill"]) {
      Item._prepareSkillFlawData(item);
      actor.calculateIncrements(actor)
    }
    for (const item of items["technique"]) {
      Item._prepareTechniqueData(item);
      actor.calculateIncrements(actor);
    }
    
    actor.calculateActiveAttributes(actor, characterType);
    actor.calculateHealth(actor, characterType);
    actor.calculateStamina(actor, characterType);
    actor.calculateIncrements(actor);
    actor.calculateTechniquePoints(actor, characterType);
    actor.calculateDefense(actor, characterType);
    actor.calculateResistance(actor, characterType);
    actor.calculateAttack(actor, characterType);
    actor.calculateMove(actor, characterType);
    actor.calculateInitiative(actor, characterType);
  }

  getCharacterType(actor) {
    let characterType;

    switch (actor.system.misc.type.value.toLowerCase()) {
      case 'flunkie': characterType = VALOR.characterTypes.flunkie; break;
      case 'soldier': characterType = VALOR.characterTypes.soldier; break;
      case 'elite': characterType = VALOR.characterTypes.elite; break;
      case 'master': characterType = VALOR.characterTypes.master; break;
      case 'swarm': characterType = VALOR.characterTypes.swarm; break;
      case 'summon': characterType = VALOR.characterTypes.summon; break;
    }
    return characterType;
  }

  /**
   * Calculate character statistics
   */

  calculateExperience(actor, characterType) {
    let curLevel = actor.system.misc.level.value;
    actor.system.misc.experience.reward.value = curLevel * characterType.experienceValue;
    actor.system.misc.experience.nextLevel = ((curLevel * (curLevel+1)) / 2) * 100;
  }

  calculateSeason(actor) {
    actor.system.misc.season.value = Math.ceil(actor.system.misc.level.value / 5);
  }

  calculateAttributePoints(actor, characterType) {
    let level = actor.system.misc.level.value;
    let maxBaseAttribute =  level + 7;
    let minBaseAttribute =  1;

    //set base attributes to be in range of min and max attribute values
    for (const attribute of Object.keys(VALOR.attributes.base)) {
      if (actor.system.attribute[attribute].value > maxBaseAttribute) {
        actor.system.attribute[attribute].value  = maxBaseAttribute;
      } else if (actor.system.attribute[attribute].value < minBaseAttribute) {
        actor.system.attribute[attribute].value = minBaseAttribute;
      }
    }

    actor.system.misc.attributePoints.total = 22 + (level * 3)
        + (actor.system.misc.attributePoints.bonus ?? 0);

    actor.system.misc.attributePoints.spent = actor.system.attribute.strength.value +
        actor.system.attribute.agility.value +
        actor.system.attribute.spirit.value +
        actor.system.attribute.mind.value +
        actor.system.attribute.guts.value;
  }

  calculateSkillPoints(actor, characterType) {
    let level = actor.system.misc.level.value;
    let flawMaxBonusSP = 7 + level;
    
    actor.system.misc.skillPoints.flawBonus.maxFlawSP.value = flawMaxBonusSP;
    actor.system.misc.skillPoints.total.value = Math.ceil((characterType.baseSkillPoints
        + (characterType.levelSkillPoints * level))
        + Math.min(actor.system.misc.skillPoints.flawBonus.value ?? 0, flawMaxBonusSP)
        * characterType.multiplierSkillPoints);
  }

  calculateTechniquePoints(actor, characterType) {
    let level = actor.system.misc.level.value;
    let season = actor.system.misc.season.value;
    let currentSeasonLevels =  (level % 5);

    let techniquePoints =  characterType.baseTechniquePoints
        + ((characterType.levelTechniquePoints-1) * level)
        + (actor.system.misc.techniquePoints.bonus ?? 0);

    if (currentSeasonLevels > 0) {
      techniquePoints += season * currentSeasonLevels;
      --season;
    }
    if (season > 0) {
      techniquePoints += ((season * (season + 1)) / 2) * 5;
    }

    techniquePoints = Math.ceil(characterType.multiplierTechniquePoints * techniquePoints);

    actor.system.misc.techniquePoints.total.value = techniquePoints;
  }

  calculateActiveAttributes(actor, characterType) {
    for (let i = 0; i < Object.keys(VALOR.attributes.active).length; i++ ) {
      actor.system.attribute[Object.keys(VALOR.attributes.active)[i]].value = Math.ceil((actor.system.attribute[Object.keys(VALOR.attributes.base)[i]].value + actor.system.misc.level.value) / 2)
          + characterType.modifierActiveAttribute;
    }
  }

  calculateHealth(actor, characterType) {
    actor.system.statistic.health.max.value = Math.ceil((50 +
            + (5 * actor.system.attribute.strength.value)
            + (10 * actor.system.attribute.guts.value)
            + (10 * actor.system.misc.level.value))
        * characterType.healthMultiplier);
  }


  calculateStamina(actor, characterType) {
    actor.system.statistic.stamina.max.value = Math.ceil((8
        + (2 * actor.system.attribute.spirit.value)
        + (2 * actor.system.attribute.mind.value)
        + (4 * actor.system.misc.level.value))
        * characterType.staminaMultiplier);
  }

  calculateAttack(actor, characterType) {
    let baseAttributes = Object.keys(VALOR.attributes.base);
    baseAttributes.pop("guts");

    for (const baseAttribute of baseAttributes) {
      actor.system.statistic.attack[baseAttribute].value = Math.ceil((((actor.system.attribute[baseAttribute].value
                  * characterType.multiplierAttackBaseAttribute)
              + actor.system.misc.level.value) * 2)
          * characterType.multiplierAttackTotal);
    }
  }

  calculateDamageIncrement(actor, characterType) {
    actor.system.statistic.damageIncrement.value = Math.ceil((5
        + actor.system.misc.level.value)
        * characterType.multiplierDamageIncrement);
  }

  calculateDefense(actor) {
    actor.system.statistic.defense.value = actor.system.attribute.strength.value
        + actor.system.attribute.guts.value
        + (2 * actor.system.misc.level.value);
  }

  calculateResistance(actor) {
    actor.system.statistic.resistance.value = actor.system.attribute.spirit.value
        + actor.system.attribute.mind.value
        + (2 * actor.system.misc.level.value);
  }

  calculateMove(actor) {
    actor.system.statistic.move.value = 3
        + Math.floor((actor.system.attribute.agility.value - 1) / 4);
  }

  calculateInitiative(actor) {
    actor.system.statistic.initiative.value = actor.system.attribute.dexterity.value;
  }

  calculateZoneOfControl(actor, characterType) {
    actor.system.misc.zoneOfControl.value = characterType.baseZoneOfControl;
  }

  calculateSize(actor, characterType) {
    actor.system.misc.size.value = characterType.baseSize;
  }

  calculateValor(actor, characterType) {
    if (characterType.hasValor === false) {
      actor.system.statistic.valor.value = 0;
      actor.system.statistic.valor.min.value = 0;
      actor.system.statistic.valor.max.value = 0;
      actor.system.statistic.valor.initial.value = 0;
      actor.system.statistic.valor.perTurn.value = 0;
    } else {
      actor.system.statistic.valor.min.value = -20;
      actor.system.statistic.valor.max.value = 10;
      actor.system.statistic.valor.initial.value = 0;
      actor.system.statistic.valor.perTurn.value = characterType.valorPerTurn;
    }

    if (actor.system.statistic.valor.value > actor.system.statistic.valor.max.value) {
      actor.system.statistic.valor.value  = actor.system.statistic.valor.max.value;
    } else if (actor.system.statistic.valor.value < actor.system.statistic.valor.min.value) {
      actor.system.statistic.valor.value  = actor.system.statistic.valor.min.value;
    }
  }

  calculateUltimateTechniques(actor, characterType) {
    if (characterType.hasUltimateTechnique === false) {
      actor.system.misc.ultimateTechniques.value = 0;
    } else {
      actor.system.misc.ultimateTechniques.value = Math.floor(actor.system.misc.level.value / 5);
    }
  }

  calculateIncrements(actor) {
    actor.system.statistic.health.increment.value = Math.ceil(actor.system.statistic.health.max.value / 5);
    actor.system.statistic.health.critical.value = (actor.system.statistic.health.increment.value * 2) - 1;
    actor.system.statistic.stamina.increment.value = Math.ceil(actor.system.statistic.stamina.max.value / 5);
  }




  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
  //   if (data.abilities) {
  //     for (let [k, v] of Object.entries(data.abilities)) {
  //       data[k] = foundry.utils.deepClone(v);
  //     }
  //   }
  //
  //   // Add level for easier access, or fall back to 0.
  //   if (data.attributes.level) {
  //     data.lvl = data.attributes.level.value ?? 0;
  //   }
  }


}