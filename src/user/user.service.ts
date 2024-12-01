import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import {UpdateUserDto} from "./dto/update.user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(createUserDto: CreateUserDto) {
        if (await this.findByEmail(createUserDto.email)) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await hash(createUserDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });

        const { password, ...result } = user;
        return result;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true,
                user_role: {
                    select: {
                        roles: {
                            select: {
                                id: true,
                                name: true,
                                role_permission: {
                                    select: {
                                        permissions: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const formattedUsers = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles: user.user_role.map((userRole) => ({
                name: userRole.roles.name,
                permissions: userRole.roles.role_permission.map(
                    (rolePermission) => rolePermission.permissions.name,
                ),
            })),
        }));

        return formattedUsers;
    }
    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerifiedAt: true,
                createdAt: true,
                updatedAt: true,
                user_role: {
                    select: {
                        roles: {
                            select: {
                                id: true,
                                name: true,
                                role_permission: {
                                    select: {
                                        permissions: {
                                            select: {
                                                name: true,
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        })
        if (!user) {
            throw new NotFoundException(`The Data with id ${id} is not found`);
        }
        const result = {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerifiedAt: user.emailVerifiedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles: user.user_role.map((userRole) => ({
                name: userRole.roles.name,
                permissions: userRole.roles.role_permission.map(
                    (rolePermission) => rolePermission.permissions.name,
                ),
            })),
        };
        return result;
    }
    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`The data with id ${id} is not found`);
        }

        if (updateUserDto.email != user.email) {
            if (await this.findByEmail(updateUserDto.email)) {
                throw new ConflictException('Email is exist');
            }
        }
        const updatedData = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateUserDto,
                password: await hash(updateUserDto.password, 10),
            },
        });
        const { password, ...result } = updatedData;
        return result;
    }
    async remove(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {id},
        })
        if (!user) {
            throw new NotFoundException(`The data with id ${id} is not found`);
        }
        const deleteData = await this.prisma.user.delete({
            where: { id },
        })

        const {password, ...result } = deleteData;
        return result;
    }

    }


