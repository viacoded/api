import {Body, Controller, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {Permission} from "../auth/permission/permission.decorator";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller({
    path: "user",
    version: "1",
})

export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Permission("user create")
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }
}
