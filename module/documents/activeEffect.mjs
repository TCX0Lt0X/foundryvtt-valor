
import { VALOR } from "../helpers/config.mjs"
import {updateGrandParent} from "../utils.mjs";

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class valorActiveEffect extends ActiveEffect {

    _onCreate(data, options, userId) {
        let activeEffect = this;

        super._onCreate(data, options, userId);

        updateGrandParent(activeEffect);
    }

    _onUpdate(data, options, userId) {
        let activeEffect = this;

        super._onUpdate(data, options, userId);

        updateGrandParent(activeEffect);
    }

    _onDelete(options, userId) {
        let activeEffect = this;

        super._onDelete(options, userId);

        updateGrandParent(activeEffect);
    }

}