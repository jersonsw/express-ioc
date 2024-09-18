import {Type} from "../providers/type";
import {getMetadata} from 'reflect-metadata/no-conflict';
import {MetaType} from './meta.type';
import {EntitySchema} from 'typeorm';
import {MetaKeys} from './meta-keys';
import {EntityTarget} from 'typeorm/common/EntityTarget';

export const InjectRepository = (token: Function | EntitySchema) => {
    return (target: Type<any>, propertyKey: string | symbol | undefined, index: number): void => {
        const paramsTypes = getMetadata(MetaType.ParamTypes, target) || [];
        paramsTypes[index] = token;

        Reflect.defineMetadata(MetaType.ParamTypes, paramsTypes, target);
    };
}
