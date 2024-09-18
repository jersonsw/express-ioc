import {HttpVerb} from '../ioc/enums/http-verb';

export const HTTP_METHOD_SUCCESS_CODE: { [Property in HttpVerb]: number } = {
    get: 200,
    post: 201,
    put: 200,
    delete: 204,
    patch: 200,
    options: 200,
    head: 200,
    connect: 200,
    trace: 200,
}
