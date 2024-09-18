import {Type} from "./type";
import {Provider} from "./provider";

export interface ClassProvider extends Provider{
    useClass: Type<any>;
    deps?: any[];
}
