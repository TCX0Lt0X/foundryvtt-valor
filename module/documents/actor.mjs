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

    
    this.calculateActiveAttributes(data);
    this.calculateHealth(data);
    this.calculateStamina(data);
    this.calculateAttack(data);
    this.calculateDamageIncrement(data);
    this.calculateDefense(data);
    this.calculateResistance(data);
    this.calculateMove(data);
    this.calculateInitiative(data);
  }


  /**
   * Calculate character statistics
   */
  calculateActiveAttributes(data) {
    data.attribute.muscle.value = Math.ceil((data.attribute.strength.value + data.misc.level.value)/2);
    data.attribute.dexterity.value = Math.ceil((data.attribute.agility.value + data.misc.level.value)/2);
    data.attribute.aura.value = Math.ceil((data.attribute.spirit.value + data.misc.level.value)/2);
    data.attribute.intuition.value = Math.ceil((data.attribute.mind.value + data.misc.level.value)/2);
    data.attribute.resolve.value = Math.ceil((data.attribute.guts.value + data.misc.level.value)/2);
  }

  calculateHealth(data) {
    let health = 50 + (5 * data.attribute.strength.value) + (10 * data.attribute.guts.value)  + (10 * data.misc.level.value);
    let healthIncrement = Math.ceil(health / 5);
    data.statistic.health.max = health;
    data.statistic.health.increment = healthIncrement
    data.statistic.health.critical = (healthIncrement * 2) - 1;
  }

  calculateStamina(data) {
    let stamina = 8 + (2 * data.attribute.spirit.value) + (2 * data.attribute.mind.value)  + (4 * data.misc.level.value);
    data.statistic.stamina.max = stamina
    data.statistic.stamina.increment = Math.ceil(stamina / 5);
  }

  calculateAttack(data) {
    data.statistic.attack.strength.value = Math.ceil((data.attribute.strength.value + data.misc.level.value) * 2);
    data.statistic.attack.agility.value = Math.ceil((data.attribute.agility.value + data.misc.level.value) * 2);
    data.statistic.attack.mind.value = Math.ceil((data.attribute.mind.value + data.misc.level.value) * 2);
    data.statistic.attack.spirit.value = Math.ceil((data.attribute.spirit.value + data.misc.level.value) * 2);
  }

  calculateDamageIncrement(data) {
    data.statistic.damageIncrement.value = 5 + data.misc.level.value;
  }

  calculateDefense(data) {
    data.statistic.defense.value = data.attribute.strength.value + data.attribute.guts.value + (2 * data.misc.level.value);
  }

  calculateResistance(data) {
    data.statistic.resistance.value = data.attribute.spirit.value + data.attribute.mind.value + (2 * data.misc.level.value);
  }

  calculateMove(data) {
    data.statistic.move.value = 3 + Math.floor((data.attribute.agility.value - 1) / 4);
  }

  calculateInitiative(data) {
    data.statistic.initiative.value = data.attribute.dexterity.value;
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