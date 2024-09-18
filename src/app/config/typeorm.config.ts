import {DataSource} from 'typeorm';
import {DataSourceOptions} from 'typeorm/data-source/DataSourceOptions';
import {SeederOptions} from 'typeorm-extension';
import {ConfigService} from '../../framework/config/config.service';
import {CustomNamingStrategy} from './custom-naming.strategy';

type TypeOrmOptions = DataSourceOptions & SeederOptions;

const config = new ConfigService();
export const typeormConfig = config.get<TypeOrmOptions>('typeorm');

export default new DataSource({...typeormConfig, namingStrategy: new CustomNamingStrategy()});
