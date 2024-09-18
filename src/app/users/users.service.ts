import {Injectable} from '../../framework/ioc/decorators/injectable.decorator';
import {ConfigService} from '../../framework/config/config.service';

@Injectable()
export class UsersService {

    constructor(private config: ConfigService) {}

    findAll(): any {
        return this.config.get('db');
    }

    findOne() {
        return this.config.get('db.postgres');
    }
}
