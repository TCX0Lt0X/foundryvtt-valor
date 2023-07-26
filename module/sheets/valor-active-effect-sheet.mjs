import { VALOR } from '../helpers/config.mjs';

/**
 * Extend the basic ActiveEffectConfig with some very simple modifications
 * @extends {ActiveEffectConfig}
 */
export class valorActiveEffectConfig extends ActiveEffectConfig {
    
    get template(){
        return "systems/valor/templates/active-effect-config.html";
    }
    async getData(){
        const sheetData = await super.getData();

        sheetData.config = VALOR;

        return sheetData;
    }
}