import {GeneralProvider} from '../providers/general-provider.type';
import {Type} from '../providers/type';

export interface ModuleParams {
    controllers?: any;
    imports?: any;
    providers?: (GeneralProvider | Type<any>)[];
}

export interface DynamicModuleParams extends ModuleParams {
    module: Type<any>;
}
