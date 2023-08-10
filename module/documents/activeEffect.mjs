
import { VALOR } from "../helpers/config.mjs"
import {updateGrandParent} from "../utils.mjs";

/**
 * Extend the base ActiveEffect for modification.
 * @override
 */
export class valorActiveEffect extends ActiveEffect {

    _onCreate(data, options, userId) {
        let activeEffect = this;

        super._onCreate(data, options, userId);

        updateGrandParent(activeEffect);
    }


    /**
     * used to update actor of activeEffects parent item when updated
     * @override
     * @param data
     * @param options
     * @param userId
     * @private
     */
    _onUpdate(data, options, userId) {
        let activeEffect = this;

        super._onUpdate(data, options, userId);

        updateGrandParent(activeEffect);
    }

    /**
     * used to update actor of activeEffects parent item when deleted
     * @override
     * @param data
     * @param options
     * @param userId
     * @private
     */
    _onDelete(options, userId) {
        let activeEffect = this;

        super._onDelete(options, userId);

        updateGrandParent(activeEffect);
    }

}