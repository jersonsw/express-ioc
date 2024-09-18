import {Module} from './framework/ioc/decorators/module.decorator';
import {UsersController} from './app/users/users.controller';
import {UsersService} from './app/users/users.service';
import {CompaniesController} from './app/users/companies.controller';
import {EmployeesModule} from './app/employees/employees.module';
import {TypeormModule} from './framework/typeorm/typeorm.module';
import {typeormConfig} from './app/config/typeorm.config';

@Module({
    imports: [EmployeesModule, TypeormModule.forRoot(typeormConfig)],
    controllers: [UsersController, CompaniesController],
    providers: [UsersService]
})
export class MainModule {
}
