import 'reflect-metadata';
import {MetaKeys} from './meta-keys';
import {RequestMapping} from '../../types/request.mapping';
import {HttpVerb} from '../enums/http-verb';

const {RequestMapping} = MetaKeys;

export const Get = (path: string = '') => {
    return (target: Object, handler: string, descriptor: PropertyDescriptor): void => {
        const mappings = (Reflect.getMetadata(RequestMapping, target.constructor) || []) as Array<RequestMapping>;
        const mapping = {path, handler, httpVerb: HttpVerb.Get} as RequestMapping;

        Reflect.defineMetadata(
            RequestMapping,
            [mapping, ...mappings],
            target.constructor
        );
    };
};
