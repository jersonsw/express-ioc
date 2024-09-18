import {Provider} from "./provider";

export interface FactoryProvider extends Provider{
    useFactory: Function;
    deps?: any[];
}