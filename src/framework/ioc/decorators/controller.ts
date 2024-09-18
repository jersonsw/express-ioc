import 'reflect-metadata';
import {MetaKeys} from './meta-keys';
import {GenericClassDecorator} from './generic-class-decorator.type';
import {Type} from '../providers/type';

export const Controller = (prefix: string = ''): GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
        Reflect.defineMetadata(MetaKeys.Prefix, prefix, target);
        Reflect.defineMetadata(MetaKeys.Token, target, target);
    };
};
