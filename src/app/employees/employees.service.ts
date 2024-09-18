import {Injectable} from '../../framework/ioc/decorators/injectable.decorator';
import {ConfigService} from '../../framework/config/config.service';
import {Repository} from 'typeorm';
import {EmployeeEntity} from '../data/entities/employee.entity';
import {InjectRepository} from '../../framework/ioc/decorators/inject-repository.decorator';

@Injectable()
export class EmployeesService {
    constructor(private config: ConfigService, @InjectRepository(EmployeeEntity) private repository: Repository<EmployeeEntity>) {
    }

    async findAll(): Promise<any[]> {
        return this.repository.find();
    }
}
