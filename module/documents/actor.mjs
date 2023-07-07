import { VALOR } from "../helpers/config.mjs"

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

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
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

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    //this._prepareCharacterData(actor);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actor) {
    if (actor.type !== 'character') return;

    // Make modifications to data here. For example:
    const characterType = actor.getCharacterType(actor)

    actor.prepareSkillFlawModifiers(actor);
    actor.calculateExperience(actor, characterType);
    actor.calculateSeason(actor);
    actor.calculateAttributePoints(actor);
    actor.calculateSkillPoints(actor, characterType);
    actor.calculateTechniquePoints(actor, characterType);
    actor.calculateActiveAttributes(actor, characterType);
    actor.calculateHealth(actor, characterType);
    actor.calculateStamina(actor, characterType);
    actor.calculateAttack(actor, characterType);
    actor.calculateDamageIncrement(actor, characterType);
    actor.calculateDefense(actor, characterType);
    actor.calculateResistance(actor, characterType);
    actor.calculateMove(actor, characterType);
    actor.calculateInitiative(actor, characterType);
    actor.calculateZoneOfControl(actor, characterType);
    actor.calculateSize(actor, characterType);
    actor.calculateValor(actor, characterType);
    actor.calculateUltimateTechniques(actor, characterType);
  }









  prepareSkillFlawModifiers(actor) {
    // const flaws = actor.itemTypes.flaw;
    // const skills = actor.itemTypes.skill;
    //
    // for (const item of flaws) {
    //   if (item.system.action === "passive") {
    //     console.log(item);
    //     // item.system.modifiers.push([{base:20, levelUp:5, targeData:"str"}]);
    //     for (const modifier of item.system.modifiers) {
    //       console.log(modifier);
    //       }
    //     }
    //     //[Object.keys(item.toObject().system.modifiers)] = item.toObject().system.modifiers;
    // }
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
    actor.system.misc.experience.value = curLevel * characterType.experienceValue;
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
    if (actor.system.attribute.strength.value > maxBaseAttribute) {
      actor.system.attribute.strength.value  = maxBaseAttribute;
    } else if (actor.system.attribute.strength.value < minBaseAttribute) {
      actor.system.attribute.strength.value = minBaseAttribute;
    }
    if (actor.system.attribute.agility.value > maxBaseAttribute) {
      actor.system.attribute.agility.value  = maxBaseAttribute;
    } else if (actor.system.attribute.agility.value < minBaseAttribute) {
      actor.system.attribute.agility.value = minBaseAttribute;
    }
    if (actor.system.attribute.spirit.value > maxBaseAttribute) {
      actor.system.attribute.spirit.value  = maxBaseAttribute;
    } else if (actor.system.attribute.spirit.value < minBaseAttribute) {
      actor.system.attribute.spirit.value = minBaseAttribute;
    }
    if (actor.system.attribute.mind.value > maxBaseAttribute) {
      actor.system.attribute.mind.value  = maxBaseAttribute;
    } else if (actor.system.attribute.mind.value < minBaseAttribute) {
      actor.system.attribute.mind.value = minBaseAttribute;
    }
    if (actor.system.attribute.guts.value > maxBaseAttribute) {
      actor.system.attribute.guts.value  = maxBaseAttribute;
    } else if (actor.system.attribute.guts.value < minBaseAttribute) {
      actor.system.attribute.guts.value = minBaseAttribute;
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
    let flawMaxBonusSP = 7 + level

    actor.system.misc.skillPoints.total = Math.ceil((characterType.baseSkillPoints
        + (characterType.levelSkillPoints * level))
        + Math.min(actor.system.misc.skillPoints.flawBonus ?? 0, flawMaxBonusSP)
        + (actor.system.misc.skillPoints.bonus ?? 0)
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

    actor.system.misc.techniquePoints.total = techniquePoints;
  }

  calculateActiveAttributes(actor, characterType) {
    let level = actor.system.misc.level.value;

    let activeAttributes = [["strength", "muscle"], ["agility", "dexterity"], ["spirit", "aura"], ["mind", "intuition"], ["guts", "resolve"]];

    for (const activeAttribute of activeAttributes) {
      actor.system.attribute[activeAttribute[1]].value = Math.ceil((actor.system.attribute[activeAttribute[0]].value + level) / 2)
          + characterType.modifierActiveAttribute
          + (actor.system.attribute[activeAttribute[1]].bonus ?? 0);
    }
  }

  calculateHealth(actor, characterType) {
    let health = Math.ceil((50 +
        + (5 * actor.system.attribute.strength.value)
        + (10 * actor.system.attribute.guts.value)
        + (10 * actor.system.misc.level.value)
        + (actor.system.statistic.health.bonus ?? 0) )
        * characterType.healthMultiplier);

    let healthIncrement = Math.ceil(health / 5);
    actor.system.statistic.health.max = health;
    actor.system.statistic.health.increment = healthIncrement
    actor.system.statistic.health.critical = (healthIncrement * 2) - 1;
  }

  calculateStamina(actor, characterType) {
    let stamina = Math.ceil((8
        + (2 * actor.system.attribute.spirit.value)
        + (2 * actor.system.attribute.mind.value)
        + (4 * actor.system.misc.level.value)
        + (actor.system.statistic.stamina.bonus ?? 0))
        * characterType.staminaMultiplier);

    actor.system.statistic.stamina.max = stamina
    actor.system.statistic.stamina.increment = Math.ceil(stamina / 5);
  }

  calculateAttack(actor, characterType) {
    actor.system.statistic.attack.strength.value = Math.ceil((((actor.system.attribute.strength.value * characterType.multiplierAttackBaseAttribute) + actor.system.misc.level.value) * 2)
        + (actor.system.statistic.attack.strength.bonus ?? 0)
        * characterType.multiplierAttackTotal);

    actor.system.statistic.attack.agility.value = Math.ceil((((actor.system.attribute.agility.value * characterType.multiplierAttackBaseAttribute) + actor.system.misc.level.value) * 2)
        + (actor.system.statistic.attack.agility.bonus ?? 0)
        * characterType.multiplierAttackTotal);

    actor.system.statistic.attack.mind.value = Math.ceil((((actor.system.attribute.mind.value * characterType.multiplierAttackBaseAttribute) + actor.system.misc.level.value) * 2)
        + (actor.system.statistic.attack.mind.bonus ?? 0)
        * characterType.multiplierAttackTotal);

    actor.system.statistic.attack.spirit.value = Math.ceil((((actor.system.attribute.spirit.value * characterType.multiplierAttackBaseAttribute) + actor.system.misc.level.value) * 2)
        + (actor.system.statistic.attack.spirit.bonus ?? 0)
        * characterType.multiplierAttackTotal);
  }

  calculateDamageIncrement(actor, characterType) {
    actor.system.statistic.damageIncrement.value = Math.ceil((5
        + actor.system.misc.level.value
        + (actor.system.statistic.damageIncrement.bonus ?? 0))
        * characterType.multiplierDamageIncrement);
  }

  calculateDefense(actor) {
    actor.system.statistic.defense.value = actor.system.attribute.strength.value
        + actor.system.attribute.guts.value
        + (2 * actor.system.misc.level.value)
        + (actor.system.statistic.defense.bonus ?? 0);
  }

  calculateResistance(actor) {
    actor.system.statistic.resistance.value = actor.system.attribute.spirit.value
        + actor.system.attribute.mind.value
        + (2 * actor.system.misc.level.value)
        + (actor.system.statistic.resistance.bonus ?? 0);
  }

  calculateMove(actor) {
    actor.system.statistic.move.value = 3
        + Math.floor((actor.system.attribute.agility.value - 1) / 4)
        + (actor.system.statistic.move.bonus ?? 0);
  }

  calculateInitiative(actor) {
    actor.system.statistic.initiative.value = actor.system.attribute.dexterity.value
        + (actor.system.statistic.initiative.bonus ?? 0);
  }

  calculateZoneOfControl(actor, characterType) {
    actor.system.misc.zoneOfControl.value = characterType.baseZoneOfControl
        + (actor.system.misc.zoneOfControl.bonus ?? 0);
  }

  calculateSize(actor, characterType) {
    actor.system.misc.size.value = characterType.baseSize
        + (actor.system.misc.size.bonus ?? 0);
  }

  calculateValor(actor, characterType) {
    if (characterType.hasValor === false) {
      actor.system.statistic.valor.value = 0;
      actor.system.statistic.valor.min.value = 0;
      actor.system.statistic.valor.max.value = 0;
      actor.system.statistic.valor.initial.value = 0;
      actor.system.statistic.valor.perTurn.value = 0;
    } else {
      actor.system.statistic.valor.min.value = -20 + (actor.system.statistic.valor.min.bonus ?? 0);
      actor.system.statistic.valor.max.value = 10 + (actor.system.statistic.valor.max.bonus ?? 0);
      actor.system.statistic.valor.initial.value = 0 + (actor.system.statistic.valor.initial.bonus ?? 0);
      actor.system.statistic.valor.perTurn.value = characterType.valorPerTurn + (actor.system.statistic.valor.perTurn.bonus ?? 0);
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
      actor.system.misc.ultimateTechniques.value = Math.floor(actor.system.misc.level.value / 5)
          + (actor.system.misc.ultimateTechniques.bonus ?? 0);
    }
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