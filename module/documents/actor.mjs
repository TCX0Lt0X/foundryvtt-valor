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
    this.calculateHealth();
    this.calculateStamina();
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
    data.attribute.active.muscle.value = Math.max(Math.ceil((data.attribute.base.strength.value + data.misc.level.value)/2), 0);
    data.attribute.active.dexterity.value = Math.max(Math.ceil((data.attribute.base.agility.value + data.misc.level.value)/2), 0);
    data.attribute.active.aura.value = Math.max(Math.ceil((data.attribute.base.spirit.value + data.misc.level.value)/2), 0);
    data.attribute.active.intuition.value = Math.max(Math.ceil((data.attribute.base.mind.value + data.misc.level.value)/2), 0);
    data.attribute.active.resolve.value = Math.max(Math.ceil((data.attribute.base.guts.value + data.misc.level.value)/2), 0);
  }

  calculateHealth(data) {
    data.statistic.health.max = 50 + (5 * data.attribute.base.strength.value) + (10 * data.attribute.base.guts.value)  + (10 * data.misc.level.value);
    data.statistic.health.increment = Math.ceil(data.statistic.health.max / 5);
    data.statistic.health.critical = (data.statistic.health.increment * 2) - 1;
  }

  calculateStamina(data) {
    data.statistic.stamina.max = 8 + (2 * data.attribute.base.spirit.value) + (2 * data.attribute.base.mind.value)  + (4 * data.misc.level.value);
    data.statistic.stamina.increment = Math.ceil(data.statistic.stamina.max / 5);
  }

  calculateAttack(data) {
    data.statistic.attack.strength.value = Math.ceil((data.attribute.base.strength.value + data.misc.level.value)*2);
    data.statistic.attack.agility.value = Math.ceil((data.attribute.base.agility.value + data.misc.level.value)*2);
    data.statistic.attack.mind.value = Math.ceil((data.attribute.base.mind.value + data.misc.level.value)*2);
    data.statistic.attack.spirit.value = Math.ceil((data.attribute.base.spirit.value + data.misc.level.value)*2);
  }

  calculateDamageIncrement(data) {
    data.statistic.DamageIncrement.value = 5 + data.misc.level.value;
  }

  calculateDefense(data) {
    data.statistic.defense.value = data.attribute.base.strength.value + data.attribute.base.guts.value + (2 * data.misc.level.value);
  }

  calculateResistance(data) {
    data.statistic.resistance.value = data.attribute.base.spirit.value + data.attribute.base.mind.value + (2 * data.misc.level.value);
  }

  calculateMove(data) {
    data.statistic.move.value = 3 + Math.floor((data.attribute.base.agility.value - 1) / 4);
  }

  calculateInitiative(data) {
    data.statistic.initiative.value = data.attribute.active.dexterity.value;
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