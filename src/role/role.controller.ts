import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {RoleService} from "./role.service";
import {Permission} from "../auth/permission/permission.decorator";
import {CreateRoleDto} from "./dto/create-role.dto";
import {UpdateUserDto} from "../user/dto/update.user.dto";
import {UpdateRoleDto} from "./dto/update-role.dto";

@Controller({
    path: 'role',
    version: '1',
})
export class RoleController {
    constructor( protected readonly roleService: RoleService) {}

    @Post()
    @Permission("role create")
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @Permission("role read")
    findAll() {
        return this.roleService.findAll();
    }

    @Get(":id")
    @Permission("role read")
    findOne(@Param("id") id: string) {
        return this.roleService.findOne(id);
    }
    @Patch(':id')
    @Permission('role update')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @Permission("role delete")
    remove(@Param('id') id: string) {
        return this.roleService.remove(id);
    }
}
