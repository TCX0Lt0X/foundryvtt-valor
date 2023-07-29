export const VALOR = {};

// Define constants here, such as:
VALOR.foobar = {
  'bas': 'VALOR.bas',
  'bar': 'VALOR.bar'
};

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */
VALOR.attributes = {
  base: {
    "strength": "VALOR.baseAttributeStr",
    "agility": "VALOR.baseAttributeAgi",
    "mind": "VALOR.baseAttributeMnd",
    "spirit": "VALOR.baseAttributeSpt",
    "guts": "VALOR.baseAttributeGut"
  }, active: {
    "muscle": "VALOR.activeAttributeMus",
    "dexterity": "VALOR.activeAttributeDex",
    "intuition": "VALOR.activeAttributeInt",
    "aura": "VALOR.activeAttributeAra",
    "resolve": "VALOR.activeAttributeRes"
  }
};

VALOR.activeAbilities = {
  "muscle": "VALOR.AbilityMus",
  "dexterity": "VALOR.AbilityDex",
  "intuition": "VALOR.AbilityInt",
  "aura": "VALOR.AbilityAra",
  "resolve": "VALOR.AbilityRes"
};

VALOR.abilityAbbreviations = {
  "str": "VALOR.AbilityStrAbbr",
  "agi": "VALOR.AbilityAgiAbbr",
  "mnd": "VALOR.AbilityMndAbbr",
  "spt": "VALOR.AbilitySptAbbr",
  "gut": "VALOR.AbilityGutAbbr",
  "mus": "VALOR.AbilityMusAbbr",
  "dex": "VALOR.AbilityDexAbbr",
  "int": "VALOR.AbilityIntAbbr",
  "aura": "VALOR.AbilityAraAbbr",
  "res": "VALOR.AbilityResAbbr"
};

VALOR.activeEffectStats = {
  "system.attribute.strength.value": "VALOR.baseAttributeStr",
  "system.attribute.agility.value": "VALOR.baseAttributeAgi",
  "system.attribute.mind.value": "VALOR.baseAttributeMnd",
  "system.attribute.spirit.value": "VALOR.baseAttributeSpt",
  "system.attribute.guts.value": "VALOR.baseAttributeGut",
  "system.attribute.muscle.value": "VALOR.activeAttributeMus",
  "system.attribute.dexterity.value": "VALOR.activeAttributeDex",
  "system.attribute.aura.value": "VALOR.activeAttributeAra",
  "system.attribute.intuition.value": "VALOR.activeAttributeInt",
  "system.attribute.resolve.value": "VALOR.activeAttributeRes",
  "system.statistic.health.max.value": "VALOR.healthMax",
  "system.statistic.stamina.max.value": "VALOR.staminaMax",
  "system.statistic.defense.value": "VALOR.defenseStat",
  "system.statistic.resistance.value": "VALOR.resistanceStat",
  "system.statistic.damageIncrement.value": "VALOR.stat.damageInc",
  "system.statistic.move.value": "VALOR.moveStat",
  "system.statistic.initiative.value": "VALOR.initiativeStat",
  "system.statistic.valor.value": "VALOR.startingValorStat",
  "system.statistic.valor.perTurn.value": "VALOR.perTurnValorStat",
  "system.statistic.valor.max.value": "VALOR.valorMax",
  "system.misc.techniquePoints.total.value": "VALOR.techPoints",

  "system.statistic.attack.strength.value": "VALOR.stat.attack.str",
  "system.statistic.attack.agility.value": "VALOR.stat.attack.agi",
  "system.statistic.attack.spirit.value": "VALOR.stat.attack.spi",
  "system.statistic.attack.mind.value": "VALOR.stat.attack.mnd",

  "system.misc.size.value": "VALOR.misc.size",
  "system.misc.zoneOfControl.value": "VALOR.misc.zoc",

  "system.rollModifiers.attackRolls.all": "VALOR.rollMod.attack.all",
  "system.rollModifiers.attackRolls.muscle": "VALOR.rollMod.attack.mus",
  "system.rollModifiers.attackRolls.dexterity": "VALOR.rollMod.attack.dex",
  "system.rollModifiers.attackRolls.aura": "VALOR.rollMod.attack.ara",
  "system.rollModifiers.attackRolls.intuition": "VALOR.rollMod.attack.int",
  "system.rollModifiers.attackRolls.resolve": "VALOR.rollMod.attack.res",
  "system.rollModifiers.defenseRolls.all": "VALOR.rollMod.defense.all",
  "system.rollModifiers.defenseRolls.muscle": "VALOR.rollMod.defense.mus",
  "system.rollModifiers.defenseRolls.dexterity": "VALOR.rollMod.defense.dex",
  "system.rollModifiers.defenseRolls.aura": "VALOR.rollMod.defense.ara",
  "system.rollModifiers.defenseRolls.intuition": "VALOR.rollMod.defense.int",
  "system.rollModifiers.defenseRolls.resolve": "VALOR.rollMod.defense.res"
};

VALOR.characterTypes = {
  flunkie: {
    baseSize: 1,
    baseZoneOfControl: 1,
    healthMultiplier: 0,
    staminaMultiplier: 1,
    baseSkillPoints: 14,
    levelSkillPoints: 6,
    multiplierSkillPoints: .5,
    baseTechniquePoints: 8,
    levelTechniquePoints: 4,
    multiplierTechniquePoints: .25,
    multiplierAttackTotal: .5,
    multiplierAttackBaseAttribute: 1,
    multiplierDamageIncrement: .5,
    modifierActiveAttribute: -1,
    modifierAttackRoll: 0,
    experienceValue: 5,
    hasUltimateTechnique: false,
    hasValor: false,
    valorPerTurn: 0,
    actions: {
      attack: 1,
      support: 0,
      move: 1
    }
  },
  soldier: {
    baseSize: 1,
    baseZoneOfControl: 1,
    healthMultiplier: .5,
    staminaMultiplier: 1,
    baseSkillPoints: 14,
    levelSkillPoints: 6,
    multiplierSkillPoints: .5,
    baseTechniquePoints: 8,
    levelTechniquePoints: 4,
    multiplierTechniquePoints: .5,
    multiplierAttackTotal: .5,
    multiplierAttackBaseAttribute: 1,
    multiplierDamageIncrement: .5,
    modifierActiveAttribute: -1,
    modifierAttackRoll: 0,
    experienceValue: 20,
    hasUltimateTechnique: false,
    hasValor: false,
    valorPerTurn: 0,
    actions: {
      attack: 1,
      support: 1,
      move: 1
    }
  },
  elite: {
    baseSize: 1,
    baseZoneOfControl: 1,
    healthMultiplier: 1,
    staminaMultiplier: 1,
    baseSkillPoints: 14,
    levelSkillPoints: 6,
    multiplierSkillPoints: 1,
    baseTechniquePoints: 8,
    levelTechniquePoints: 4,
    multiplierTechniquePoints: 1,
    multiplierAttackTotal: 1,
    multiplierAttackBaseAttribute: 1,
    multiplierDamageIncrement: 1,
    modifierActiveAttribute: 0,
    modifierAttackRoll: 0,
    experienceValue: 50,
    hasUltimateTechnique: true,
    hasValor: true,
    valorPerTurn: 1,
    actions: {
      attack: 1,
      support: 1,
      move: 1
    }
  },
  master: {
    baseSize: 1,
    baseZoneOfControl: 1,
    healthMultiplier: 2,
    staminaMultiplier: 2,
    baseSkillPoints: 25,
    levelSkillPoints: 7,
    multiplierSkillPoints: 1,
    baseTechniquePoints: 14,
    levelTechniquePoints: 5,
    multiplierTechniquePoints: 1,
    multiplierAttackTotal: 1,
    multiplierAttackBaseAttribute: 1.5,
    multiplierDamageIncrement: 1,
    modifierActiveAttribute: 0,
    modifierAttackRoll: 1,
    experienceValue: 200,
    hasUltimateTechnique: true,
    hasValor: true,
    valorPerTurn: 2,
    actions: {
      attack: 2,
      support: 1,
      move: 1
    }
  },
  swarm: {
    baseSize: 3,
    baseZoneOfControl: 0,
    healthMultiplier: 1,
    staminaMultiplier: 1,
    baseSkillPoints: 14,
    levelSkillPoints: 6,
    multiplierSkillPoints: 1,
    baseTechniquePoints: 8,
    levelTechniquePoints: .5,
    multiplierTechniquePoints: 1,
    multiplierAttackTotal: .5,
    multiplierAttackBaseAttribute: 1,
    multiplierDamageIncrement: 1,
    modifierActiveAttribute: 0,
    modifierAttackRoll: 0,
    experienceValue: 35,
    hasUltimateTechnique: false,
    hasValor: false,
    valorPerTurn: 0,
    actions: {
      attack: 1,
      support: 1,
      move: 1
    }
  },
  summon: {
    baseSize: 1,
    baseZoneOfControl: 1,
    healthMultiplier: .5,
    staminaMultiplier: 1,
    baseSkillPoints: 14,
    levelSkillPoints: 6,
    multiplierSkillPoints: .5,
    baseTechniquePoints: 8,
    levelTechniquePoints: 4,
    multiplierTechniquePoints: .5,
    multiplierAttackTotal: .5,
    multiplierAttackBaseAttribute: 1,
    multiplierDamageIncrement: 1,
    modifierActiveAttribute: -1,
    modifierAttackRoll: 0,
    experienceValue: 0,
    hasUltimateTechnique: false,
    hasValor: false,
    valorPerTurn: 0,
    actions: {
      attack: 1,
      support: 1,
      move: 1
    }
  }
}

VALOR.skills = {
  progression: {
    "fixed": Number.POSITIVE_INFINITY,
    "fast": 3,
    "slow": 5
  }
}