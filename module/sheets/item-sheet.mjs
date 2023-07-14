import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";
import {valorItem as Item} from "../documents/item.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class valorItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["valor", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/valor/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const item = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = item.system;
    context.flags = item.flags;

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(item.effects);

    if(item.type === 'technique') {
      this._prepareTechniqueData(context)
    }

    return context;
  }

  /* -------------------------------------------- */


  async _prepareTechniqueData(context) {
    const compendiumCores = [];
    const compendiumMods = [];
    const compendiumLimits = [];

    const techCompendium = game.packs.get("world.techniques");

    for (let techComponent of techCompendium.index) {
      if (techComponent.type == "core") {
        cores.push(techComponent);
      } else if (techComponent.type == "modifier") {
        mods.push(techComponent);
      } else if (techComponent.type == "limit") {
        limits.push(techComponent);
      }
    }

    context.compendiumCores = compendiumCores;
    context.compendiumMods = compendiumMods;
    context.compendiumLimits = compendiumLimits;
  }



  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.item));

    html.find(".modifier-control").click(ev => onManageModifier(ev, this.item));

    function onManageModifier(event, owner) {
      event.preventDefault();
      const a = event.currentTarget;
      const li = a.closest("li");
      const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
      switch ( a.dataset.action ) {
        case "create":
          let modifiers = owner.getFlag('valor', 'modifiers') ?? [];
          modifiers.push({
            base:0,
            levelUp:0,
            targetData:"",
            condition: {
              x:"true",
              y:"",
              operator:"=="
            }
          });
          return owner.setFlag('valor', 'modifiers', modifiers);
        case "edit":
          return effect.sheet.render(true);
        case "delete":
          return effect.delete();
        case "toggle":
          return effect.update({disabled: !effect.disabled});
      }
    }

  }
}
