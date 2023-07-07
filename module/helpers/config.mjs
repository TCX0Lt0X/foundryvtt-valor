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