import 'colors';
import 'reflect-metadata';
import {Container} from './ioc/container';
import {MetaKeys} from './ioc/decorators/meta-keys';
import {defaultProviders} from "./default-providers";
import {Type} from './ioc/providers/type';
import {RequestMapping} from './types/request.mapping';
import express, {Express, Request, Response} from 'express';
import {isNumber, merge} from 'lodash';
import {DateUtil} from './utils/date.util';
import {HTTP_METHOD_SUCCESS_CODE} from './constants/http-method-success-codes';
import {getMetadata} from 'reflect-metadata/no-conflict';

export class Application {
    private readonly expressApp!: Express;
    private readonly root!: Function;
    private container!: Container;

    constructor(root: Function) {
        this.root = root;
        this.container = new Container(root, defaultProviders);
        this.expressApp = express();
    }

    public async launch(port: number, cb?: () => void): Promise<void> {
        await this.container.start();

        this.wireUp(this.root);

        this.startServer(port, cb);
    }

    private wireUp(moduleToken: any) {
        const module = moduleToken.module || moduleToken;


        getMetadata(MetaKeys.Imports, module)?.forEach(this.wireUp.bind(this));
        getMetadata(MetaKeys.Controllers, module)?.forEach(async (target: any) => {
           await this.setEndpoints(target)
        });
    }

    public getExpressApp(): Express {
        return this.expressApp;
    }

    private async setEndpoints(target: any): Promise<void> {
        const controller = await this.container.resolve<any>(target);
        const prefix = getMetadata(MetaKeys.Prefix, target);

        getMetadata(MetaKeys.RequestMapping, target).forEach((mapping: RequestMapping) => {
            const {path, handler, httpVerb} = mapping;
            const paramsMap = getMetadata(`params:${handler}`, target);
            const queriesMap = getMetadata(`query:${handler}`, target);
            const reqParam = getMetadata(`req:${handler}`, target);
            const respParam = getMetadata(`resp:${handler}`, target);

            const params = merge(paramsMap, queriesMap);
            if (isNumber(reqParam)) {
                params['req: Request'] = reqParam;
            }

            if (isNumber(respParam)) {
                params['resp: Response'] = respParam;
            }

            const sortedParams = Object.keys(params).sort((a, b) => params[a] - params[b]);
            const query = Object.keys(queriesMap || {}).map(key => `${key}={${key}}`).join('&');
            const endpoint = prefix ? `/${prefix}${path}` : path;

            console.log(
                '[Application]'.green,
                process.pid.toString().yellow,
                '-',
                DateUtil.format(new Date()).blue,
                `${httpVerb.toUpperCase()}`.yellow.bold,
                `${endpoint}${query ? '?' + query : ''}`.cyan, '->'.yellow,
                `${controller.constructor.name}.${handler}(${sortedParams.join(', ')})`.green
            );

            this.expressApp[httpVerb](endpoint, this.handleRequest(controller, mapping, params));
        });
    }

    private handleRequest(controller: any, mapping: RequestMapping, params: any) {

        return async (request: Request, response: Response) => {
            const args: any[] = [];

            Object.keys(request.params || {}).forEach((key: string) => {
                const paramIndex = params[key];
                args[paramIndex] = request.params[key];
            });

            Object.keys(request.query || {}).forEach((key: string) => {
                const paramIndex = params[key];
                args[paramIndex] = request.query[key];
            });

            if (isNumber(params['req: Request'])) {
                args[params['req: Request']] = request;
            }

            if (isNumber(params['resp: Response'])) {
                args[params['resp: Response']] = response;
            }

            const result = await controller[mapping.handler](...args);
            const status = HTTP_METHOD_SUCCESS_CODE[mapping.httpVerb];

            return response.json(result).status(status);
        };
    }

    get<T>(token: Type<any>): T {
        return this.container.get(token) as T;
    }

    private startServer(port: number, cb: (() => void) | undefined) {
        this.expressApp.listen(port, () => {
            console.log(
                '[Application]'.green,
                process.pid,
                '-',
                DateUtil.format(new Date()).blue,
                '🚀Application launched on port 3000\n'.magenta.bold
            );

            if (cb) cb();
        });
    }
}
