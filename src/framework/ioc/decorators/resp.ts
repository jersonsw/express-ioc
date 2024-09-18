export const Resp = () => {
    return (target: Object, propertyKey: string, parameterIndex: number) => {
        Reflect.defineMetadata(`resp:${propertyKey}`, parameterIndex, target.constructor);
    }
}
