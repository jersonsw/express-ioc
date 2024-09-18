import {Module} from '../../framework/ioc/decorators/module.decorator';
import {EmployeesController} from './employees.controller';
import {EmployeesService} from './employees.service';

@Module({
    controllers: [EmployeesController],
    providers: [EmployeesService]
})
export class EmployeesModule {}
