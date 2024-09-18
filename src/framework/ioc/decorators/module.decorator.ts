import {ModuleParams} from './module.params';
import {MetaKeys} from './meta-keys';
import {GenericClassDecorator} from './generic-class-decorator.type';
import {Type} from '../providers/type';

export const Module = (parameters: ModuleParams): GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
        if (parameters.controllers) {
            Reflect.defineMetadata(MetaKeys.Controllers, parameters.controllers, target);
        }
        if (parameters.imports) {
            Reflect.defineMetadata(MetaKeys.Imports, parameters.imports, target);
        }
        if (parameters.providers) {
            Reflect.defineMetadata(MetaKeys.Providers, parameters.providers, target);
        }
    };
};
