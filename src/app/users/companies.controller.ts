import {Controller} from '../../framework/ioc/decorators/controller';
import {Get} from '../../framework/ioc/decorators/get';
import {UsersService} from './users.service';
import {PathParam} from '../../framework/ioc/decorators/path-param';
import {QueryParam} from '../../framework/ioc/decorators/query-param';
import {ConfigService} from '../../framework/config/config.service';
import {Req} from '../../framework/ioc/decorators/req';

@Controller('companies')
export class CompaniesController {

    constructor(private readonly usersService: UsersService, private readonly config: ConfigService) {}

    @Get('/')
    findAll(): any[] {
        return this.usersService.findAll();
    }

    @Get('/:id/:name')
    findOne(@PathParam('id') id: string,  @PathParam('name') name: string, @Req() req: Request, @QueryParam('num') num: number, @QueryParam('other') other: number): any {
        return this.usersService.findOne();
    }
}
