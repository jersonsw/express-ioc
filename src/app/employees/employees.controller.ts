import {Controller} from '../../framework/ioc/decorators/controller';
import {Get} from '../../framework/ioc/decorators/get';
import {EmployeesService} from './employees.service';
import {Req} from '../../framework/ioc/decorators/req';
import {Resp} from '../../framework/ioc/decorators/resp';
import {Request} from 'express';
import {PathParam} from '../../framework/ioc/decorators/path-param';

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Get('/all/:id')
    async findAll(@Req() req: Request, @Resp() resp: Response, @PathParam('id') id: string): Promise<any[]> {
        return this.employeesService.findAll();
    }
}
