export const QueryParam = (name: string) => {
    return (target: Object, propertyKey: string, parameterIndex: number) => {
        const params = Reflect.getMetadata(`query:${propertyKey}`, target.constructor) || {};
        params[name] = parameterIndex;

        Reflect.defineMetadata(`query:${propertyKey}`, params, target.constructor);
    }
}
