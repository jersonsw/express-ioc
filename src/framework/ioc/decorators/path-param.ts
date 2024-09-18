export const PathParam = (name: string) => {
    return (target: Object, propertyKey: string, parameterIndex: number) => {
        const params = Reflect.getMetadata(`params:${propertyKey}`, target.constructor) || {};
        params[name] = parameterIndex;

        Reflect.defineMetadata(`params:${propertyKey}`, params, target.constructor);
    }
}
