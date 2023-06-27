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
    const actorData = this;
    const data = actorData.system;
    const flags = actorData.flags.valor || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.system;

    const characterType = this.getCharacterType(data)

    this.calculateExperience(data, characterType);
    this.calculateSeason(data);
    this.calculateAttributePoints(data);
    this.calculateSkillPoints(data, characterType);
    this.calculateTechniquePoints(data, characterType);
    this.calculateActiveAttributes(data, characterType);
    this.calculateHealth(data, characterType);
    this.calculateStamina(data, characterType);
    this.calculateAttack(data, characterType);
    this.calculateDamageIncrement(data, characterType);
    this.calculateDefense(data, characterType);
    this.calculateResistance(data, characterType);
    this.calculateMove(data, characterType);
    this.calculateInitiative(data, characterType);
    this.calculateZoneOfControl(data, characterType);
    this.calculateSize(data, characterType);
    this.calculateValor(data, characterType);
    this.calculateUltimateTechniques(data, characterType);
  }

  getCharacterType(data) {
    let characterType;

    switch (data.misc.type.value.toLowerCase()) {
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
  calculateExperience(data, characterType) {
    let curLevel = data.misc.level.value;
    data.misc.experience.value = curLevel * characterType.experienceValue;
    data.misc.experience.nextLevel = ((curLevel * (curLevel+1)) / 2) * 100;

  }

  calculateSeason(data) {
    data.misc.season.value = Math.ceil(data.misc.level.value / 5);
  }

  calculateAttributePoints(data, characterType) {
    let level = data.misc.level.value;
    let maxBaseAttribute =  level + 7;
    let minBaseAttribute =  1;

    //set base attributes to be in range of min and max attribute values
    if (data.attribute.strength.value > maxBaseAttribute) {
      data.attribute.strength.value  = maxBaseAttribute;
    } else if (data.attribute.strength.value < minBaseAttribute) {
      data.attribute.strength.value = minBaseAttribute;
    }
    if (data.attribute.agility.value > maxBaseAttribute) {
      data.attribute.agility.value  = maxBaseAttribute;
    } else if (data.attribute.agility.value < minBaseAttribute) {
      data.attribute.agility.value = minBaseAttribute;
    }
    if (data.attribute.spirit.value > maxBaseAttribute) {
      data.attribute.spirit.value  = maxBaseAttribute;
    } else if (data.attribute.spirit.value < minBaseAttribute) {
      data.attribute.spirit.value = minBaseAttribute;
    }
    if (data.attribute.mind.value > maxBaseAttribute) {
      data.attribute.mind.value  = maxBaseAttribute;
    } else if (data.attribute.mind.value < minBaseAttribute) {
      data.attribute.mind.value = minBaseAttribute;
    }
    if (data.attribute.guts.value > maxBaseAttribute) {
      data.attribute.guts.value  = maxBaseAttribute;
    } else if (data.attribute.guts.value < minBaseAttribute) {
      data.attribute.guts.value = minBaseAttribute;
    }

    data.misc.attributePoints.total = 22 + (level * 3)
        + (data.misc.attributePoints.bonus ?? 0);

    data.misc.attributePoints.spent = data.attribute.strength.value +
        data.attribute.agility.value +
        data.attribute.spirit.value +
        data.attribute.mind.value +
        data.attribute.guts.value;
  }

  calculateSkillPoints(data, characterType) {
    let level = data.misc.level.value;
    let flawMaxBonusSP = 7 + level

    data.misc.skillPoints.total = Math.ceil((characterType.baseSkillPoints
        + (characterType.levelSkillPoints * level))
        + Math.min(data.misc.skillPoints.flawBonus ?? 0, flawMaxBonusSP)
        + (data.misc.skillPoints.bonus ?? 0)
        * characterType.multiplierSkillPoints);
  }

  calculateTechniquePoints(data, characterType) {
    let level = data.misc.level.value;
    let season = data.misc.season.value;
    let currentSeasonLevels =  (level % 5);

    let techniquePoints =  characterType.baseTechniquePoints
        + ((characterType.levelTechniquePoints-1) * level)
        + (data.misc.techniquePoints.bonus ?? 0);

    if (currentSeasonLevels > 0) {
      techniquePoints += season * currentSeasonLevels;
      --season;
    }
    if (season > 0) {
      techniquePoints += ((season * (season + 1)) / 2) * 5;
    }

    techniquePoints = Math.ceil(characterType.multiplierTechniquePoints * techniquePoints);

    data.misc.techniquePoints.total = techniquePoints;
  }

  calculateActiveAttributes(data, characterType) {
    let level = data.misc.level.value;

    data.attribute.muscle.value = Math.ceil((data.attribute.strength.value + level) / 2)
        + characterType.modifierActiveAttribute
        + (data.attribute.muscle.bonus ?? 0);

    data.attribute.dexterity.value = Math.ceil((data.attribute.agility.value + level) / 2)
        + characterType.modifierActiveAttribute
        + (data.attribute.dexterity.bonus ?? 0);

    data.attribute.aura.value = Math.ceil((data.attribute.spirit.value + level) / 2)
        + characterType.modifierActiveAttribute
        + (data.attribute.aura.bonus ?? 0);

    data.attribute.intuition.value = Math.ceil((data.attribute.mind.value + level) / 2)
        + characterType.modifierActiveAttribute
        + (data.attribute.intuition.bonus ?? 0);

    data.attribute.resolve.value = Math.ceil((data.attribute.guts.value + level) / 2)
        + characterType.modifierActiveAttribute
        + (data.attribute.resolve.bonus ?? 0);
  }

  calculateHealth(data, characterType) {
    let health = Math.ceil((50 +
        + (5 * data.attribute.strength.value)
        + (10 * data.attribute.guts.value)
        + (10 * data.misc.level.value)
        + (data.statistic.health.bonus ?? 0) )
        * characterType.healthMultiplier);

    let healthIncrement = Math.ceil(health / 5);

    data.statistic.health.max = health;
    data.statistic.health.increment = healthIncrement
    data.statistic.health.critical = (healthIncrement * 2) - 1;
  }

  calculateStamina(data, characterType) {
    let stamina = Math.ceil((8
        + (2 * data.attribute.spirit.value)
        + (2 * data.attribute.mind.value)
        + (4 * data.misc.level.value)
        + (data.statistic.stamina.bonus ?? 0))
        * characterType.staminaMultiplier);

    data.statistic.stamina.max = stamina
    data.statistic.stamina.increment = Math.ceil(stamina / 5);
  }

  calculateAttack(data, characterType) {
    data.statistic.attack.strength.value = Math.ceil((((data.attribute.strength.value * characterType.multiplierAttackBaseAttribute) + data.misc.level.value) * 2)
        + (data.statistic.attack.strength.bonus ?? 0)
        * characterType.multiplierAttackTotal);

    data.statistic.attack.agility.value = Math.ceil((((data.attribute.agility.value * characterType.multiplierAttackBaseAttribute) + data.misc.level.value) * 2)
        + (data.statistic.attack.agility.bonus ?? 0)
        * characterType.multiplierAttackTotal);

    data.statistic.attack.mind.value = Math.ceil((((data.attribute.mind.value * characterType.multiplierAttackBaseAttribute) + data.misc.level.value) * 2)
        + (data.statistic.attack.mind.bonus ?? 0)
        * characterType.multiplierAttackTotal);

    data.statistic.attack.spirit.value = Math.ceil((((data.attribute.spirit.value * characterType.multiplierAttackBaseAttribute) + data.misc.level.value) * 2)
        + (data.statistic.attack.spirit.bonus ?? 0)
        * characterType.multiplierAttackTotal);
  }

  calculateDamageIncrement(data, characterType) {
    data.statistic.damageIncrement.value = Math.ceil((5
        + data.misc.level.value
        + (data.statistic.damageIncrement.bonus ?? 0))
        * characterType.multiplierDamageIncrement);
  }

  calculateDefense(data) {
    data.statistic.defense.value = data.attribute.strength.value
        + data.attribute.guts.value
        + (2 * data.misc.level.value)
        + (data.statistic.defense.bonus ?? 0);
  }

  calculateResistance(data) {
    data.statistic.resistance.value = data.attribute.spirit.value
        + data.attribute.mind.value
        + (2 * data.misc.level.value)
        + (data.statistic.resistance.bonus ?? 0);
  }

  calculateMove(data) {
    data.statistic.move.value = 3
        + Math.floor((data.attribute.agility.value - 1) / 4)
        + (data.statistic.move.bonus ?? 0);
  }

  calculateInitiative(data) {
    data.statistic.initiative.value = data.attribute.dexterity.value
        + (data.statistic.initiative.bonus ?? 0);
  }

  calculateZoneOfControl(data, characterType) {
    data.misc.zoneOfControl.value = characterType.baseZoneOfControl
        + (data.misc.zoneOfControl.bonus ?? 0);
  }

  calculateSize(data, characterType) {
    data.misc.size.value = characterType.baseSize
        + (data.misc.size.bonus ?? 0);
  }

  calculateValor(data, characterType) {
    if (characterType.hasValor === false) {
      data.statistic.valor.value = 0;
      data.statistic.valor.min.value = 0;
      data.statistic.valor.max.value = 0;
      data.statistic.valor.initial.value = 0;
      data.statistic.valor.perTurn.value = 0;
    } else {
      data.statistic.valor.min.value = -20 + (data.statistic.valor.min.bonus ?? 0);
      data.statistic.valor.max.value = 10 + (data.statistic.valor.max.bonus ?? 0);
      data.statistic.valor.initial.value = 0 + (data.statistic.valor.initial.bonus ?? 0);
      data.statistic.valor.perTurn.value = characterType.valorPerTurn + (data.statistic.valor.perTurn.bonus ?? 0);
    }

    if (data.statistic.valor.value > data.statistic.valor.max.value) {
      data.statistic.valor.value  = data.statistic.valor.max.value;
    } else if (data.statistic.valor.value < data.statistic.valor.min.value) {
      data.statistic.valor.value  = data.statistic.valor.min.value;
    }
  }

  calculateUltimateTechniques(data, characterType) {
    if (characterType.hasUltimateTechnique === false) {
      data.misc.ultimateTechniques.value = 0;
    } else {
      data.misc.ultimateTechniques.value = Math.floor(data.misc.level.value / 5)
          + (data.misc.ultimateTechniques.bonus ?? 0);
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