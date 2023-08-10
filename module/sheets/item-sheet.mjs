import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";
import {onManageModifier, prepareModifiers} from "../helpers/modifiers.mjs";
import {onTechOptChange, onTechOptDelete} from "../utils.mjs";
import {VALOR} from "../helpers/config.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class valorItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["valor", "sheet", "item"],
      width: 620,
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

    context.VALOR = VALOR;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = item.system;
    context.flags = item.flags;

    // Prepare active effect
    //context.effects = prepareActiveEffectCategories(item.effects);
    context.effects = prepareModifiers(item.effects);

    if(item.type === 'technique') {
      this._prepareTechniqueSheetData(context);
    }

    return context;
  }

  /* -------------------------------------------- */

  /**
   * prepares data for Technique sheet by grabing Cores
   * Modifiers, and Limits from Compendium
   * @param context
   * @private
   */
   _prepareTechniqueSheetData(context) {
     const compendiumCores = [];
     const compendiumMods = [];
     const compendiumLimits = [];

     let techCompendium = game.packs.get("valor.techniques");

     for (let techComponent of techCompendium.index) {
       if (techComponent.type === "core") {
         compendiumCores.push(techComponent);
       } else if (techComponent.type === "modifier") {
         compendiumMods.push(techComponent);
       } else if (techComponent.type === "limit") {
         compendiumLimits.push(techComponent);
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


    //deletes a Modifier or Limit from Technique
    html.find(".techOpt").click(ev => onTechOptDelete(ev.target.getAttribute('value'), this.item));

    //changes a technique option (Core, Modifier, Limit, Attribute) to new value
    html.find(".techOptSelect").on('change', ev => onTechOptChange(ev.target.value, this.item));
  }
}
