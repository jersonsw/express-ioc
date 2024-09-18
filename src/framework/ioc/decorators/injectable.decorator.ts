/**
 * @returns {GenericClassDecorator<Type<any>>}
 * @constructor
 */
import {GenericClassDecorator} from './generic-class-decorator.type';
import {MetaKeys} from './meta-keys';
import {Type} from '../providers/type';
import {ClassProvider} from '../providers/class.provider';
import {getMetadata} from 'reflect-metadata/no-conflict';
import {MetaType} from './meta.type';

export const Injectable = (providerName?: string) : GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
        const token = providerName || target;

        Reflect.defineMetadata(MetaKeys.Token, token, target);
    };
};
