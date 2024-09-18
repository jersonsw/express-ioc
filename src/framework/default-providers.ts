import {GeneralProvider} from './ioc/providers/general-provider.type';
import {ConfigService} from './config/config.service';

export const defaultProviders: GeneralProvider[] = [
    {
        token: ConfigService,
        useClass: ConfigService
    }
];
