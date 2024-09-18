import {HttpVerb} from '../ioc/enums/http-verb';

export interface RequestMapping {
    path: string;
    handler: string;
    httpVerb: HttpVerb;
}
