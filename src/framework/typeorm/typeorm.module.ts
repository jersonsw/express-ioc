import {DynamicModuleParams} from '../ioc/decorators/module.params';
import {ValueProvider} from '../ioc/providers/value.provider';
import {TYPEORM_MODULE_OPTIONS} from './typeorm.constants';
import {FactoryProvider} from '../ioc/providers/factory.provider';
import {DataSource, DataSourceOptions} from 'typeorm';
import {DateUtil} from '../utils/date.util';
import {keyBy, uniq, uniqBy} from 'lodash';
import {defineMetadata} from 'reflect-metadata/no-conflict';
import {MetaKeys} from '../ioc/decorators/meta-keys';

export class TypeormModule {
    static forRoot(options?: DataSourceOptions): DynamicModuleParams {
        const typeOrmModuleOptions: ValueProvider = {
            token: TYPEORM_MODULE_OPTIONS,
            useValue: options,
        };

        const dataSourceProvider: FactoryProvider = {
            token: DataSource,
            useFactory: async (dataSourceOpts: DataSourceOptions): Promise<DataSource> => {
                const dataSource = new DataSource(dataSourceOpts);
                const opts = dataSourceOpts as any;

                return dataSource.initialize().then((ds) => {
                    uniqBy(dataSource.entityMetadatas, 'name').forEach((metadata) => {
                        const repository = ds.getRepository(metadata.target);

                        defineMetadata(MetaKeys.Repository, repository, metadata.target);
                    });

                    console.log(
                        '[Application]'.green,
                        process.pid.toString().yellow,
                        '-',
                        DateUtil.format(new Date()).blue,
                        `LOG`.yellow.bold,
                        'Database connection established'.magenta,
                        '->'.yellow,
                        `${dataSourceOpts.type}://${opts.host}:${opts.port}/${opts.database}`.green
                    );

                    return ds;
                });
            },
            deps: [TYPEORM_MODULE_OPTIONS],
        };

        return {
            module: TypeormModule,
            providers: [
                typeOrmModuleOptions,
                dataSourceProvider
            ],
        }
    }
}
