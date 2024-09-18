import 'reflect-metadata';
import {Type} from './providers/type';
import {MetaKeys} from './decorators/meta-keys';
import {MetaType} from './decorators/meta.type';
import {GeneralProvider} from './providers/general-provider.type';
import {getMetadata, hasMetadata} from 'reflect-metadata/no-conflict';
import {ClassProvider} from './providers/class.provider';
import {ValueProvider} from './providers/value.provider';

export class Container {
    private providersMap = new Map<any, any>();
    public dependencies = new Map<any, unknown>();
    private readonly root: Function;
    private readonly defaultProviders: GeneralProvider[] = [];

    constructor(root: Function, defaultProviders: GeneralProvider[] = []) {
        this.root = root;
        this.defaultProviders = defaultProviders;
    }

    public async start(): Promise<void> {
        this.registerDefaultProviders(this.defaultProviders);
        await this.resolveModule(this.root);
    }

    private async resolveModule(moduleToken: any): Promise<void> {
        const module = moduleToken.module || moduleToken;
        const imports = this.getImports(module);
        const providers = this.getProviders(module);
        const controllers = this.getControllers(module);

        providers.forEach(this.registerProvider.bind(this));

        for (const provider of this.providersMap.values()) {
            const instance = await this.resolveProvider(provider);

            this.dependencies.set(provider.token, instance);
        }

        for (const controller of controllers) {
            await this.resolve(controller);
        }

        for (const importToken of imports) {
            await this.resolveModule(importToken);
        }
    }

    private registerDefaultProviders(defaultProviders: GeneralProvider[]) {
        for (const provider of defaultProviders) {
            this.registerProvider(provider);
        }
    }

    private getProviders(module: Function) {
        return getMetadata(MetaKeys.Providers, module) || [];
    }

    private getControllers(module: Function) {
        return getMetadata(MetaKeys.Controllers, module) || [];
    }

    private getImports(module: Function): any[] {
        const imports = getMetadata(MetaKeys.Imports, module) || [];
        const mappedImports: any[] = [];

        for (const importToken of imports) {
            mappedImports.push(importToken.module || importToken);

            if (importToken.providers) {
                this.registerDefaultProviders(importToken.providers);
            }
        }

        return mappedImports;
    }

    public async resolve<T>(target: Type<any>): Promise<T> {
        const token: any = getMetadata(MetaKeys.Token, target) || target;

        if (this.dependencies.has(token)) {
            return this.dependencies.get(token) as T;
        }

        if (!token) {
            throw new Error(`No dependency found for target: ${target?.name || target}`);
        }

        const parameterTypes = getMetadata(MetaType.ParamTypes, target) || [];
        const params: unknown[] = [];

        for (const paramType of parameterTypes) {
            const instance = await this.resolve(paramType);
            params.push(instance);
        }

        const instance = Reflect.construct(target, params);
        this.dependencies.set(token, instance);

        return instance;
    }

    private registerProvider(provider: GeneralProvider): void {
        if (provider.token) {
            this.providersMap.set(provider.token, provider);
        } else if(hasMetadata(MetaKeys.Repository, provider)) {
            const repository = getMetadata(MetaKeys.Repository, provider);
            const repositoryProvider: ValueProvider = {
                token: provider,
                useValue: repository
            };

            this.providersMap.set(provider, repositoryProvider);
        } else {
            const deps: any[] = getMetadata(MetaType.ParamTypes, provider) || [];
            deps.forEach(dep => this.registerProvider(dep));

            const classProvider: ClassProvider = {
                token: provider,
                useClass: provider as unknown as Type<any>,
                deps
            };
            this.providersMap.set(provider, classProvider);
        }
    }

    private async resolveProvider({token, ...provider}: any): Promise<any> {
        if (this.dependencies.has(token)) {
            return this.dependencies.get(token);
        }

        if (!(provider.useClass || provider.useValue || provider.useFactory)) {
            throw new Error(`Provider type not registered for ${token}`);
        }

        const deps = await this.resolveProviderDeps(token, provider);
        let instance;

        if (provider.useClass) {
            instance = Reflect.construct(provider.useClass, deps);
        } else if (provider.useValue) {
            instance = provider.useValue;
        } else if (provider.useFactory) {
            instance = await provider.useFactory(...deps);
        }

        this.dependencies.set(token, instance);
        return instance;
    }

    private async resolveProviderDeps(token: any, provider: any): Promise<unknown[]> {
        const deps = provider.deps || [];
        const resolvedDeps: unknown[] = [];

        for (const depToken of deps) {
            const depProvider = this.providersMap.get(depToken);

            if (!depProvider) {
                throw new Error(`Provider not found for "${depToken?.name || depToken}" in ${token.name}`);
            }

            const instance = await this.resolveProvider(depProvider);
            resolvedDeps.push(instance);
        }

        return resolvedDeps;
    }

    public get<T>(token: Type<any>): T {
        return this.dependencies.get(token) as T;
    }
}
