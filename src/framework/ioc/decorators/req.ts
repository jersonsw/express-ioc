export const Req = () => {
    return (target: Object, propertyKey: string, parameterIndex: number) => {
        Reflect.defineMetadata(`req:${propertyKey}`, parameterIndex, target.constructor);
    }
}
