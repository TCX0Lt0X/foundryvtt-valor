import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";

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
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(itemData.effects);

    if (context.system.type == "flaw" || context.system.type == "skill" ) {
      console.log("honkhonk");
      //context.modifiers = prepareModifiers(itemData.flags.valor.modifiers);
    }

    return context;
  }

  /* -------------------------------------------- */






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

          let modifiers = owner.flags.valor.modifiers ?? [];
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
          console.log(modifiers);
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
