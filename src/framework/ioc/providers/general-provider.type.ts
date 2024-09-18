import {ClassProvider} from "./class.provider";
import {FactoryProvider} from "./factory.provider";
import {ValueProvider} from "./value.provider";
import {Type} from './type';

export type GeneralProvider = ClassProvider | FactoryProvider | ValueProvider;
