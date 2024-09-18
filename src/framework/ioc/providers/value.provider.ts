import {Provider} from "./provider";

export interface ValueProvider extends Provider{
    useValue: any;
}