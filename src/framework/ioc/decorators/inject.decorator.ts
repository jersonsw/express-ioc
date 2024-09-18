import {Type} from "../providers/type";
import {getMetadata} from 'reflect-metadata/no-conflict';
import {MetaType} from './meta.type';

export const Inject = (token: any) => {
    return (target: Type<any>, propertyKey: string | symbol | undefined, index: number): void => {
        const paramsTypes = getMetadata(MetaType.ParamTypes, target) || [];
        paramsTypes[index] = token;

        Reflect.defineMetadata(MetaType.ParamTypes, paramsTypes, target);
    };
}
