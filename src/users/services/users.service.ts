import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersDTO } from '../dto/users.dto';
import { UsersEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>
    ) {}

    public async registerUser(body: UsersDTO): Promise<UsersEntity> {
        try {
            body.password = await bcrypt.hash(
                body.password,
                +process.env.HASH_SALT
            );
            return await this.usersRepository.save(body)
        } catch(error) {
            throw new BadRequestException()
        }
    }

    public async getUserById(userId: string): Promise<UsersEntity> {
        try {
            const user: UsersEntity = await this.usersRepository
                .createQueryBuilder('user')
                .where({ userId })
                .leftJoinAndSelect('user.tasksIncludes', 'tasksIncludes')
                .getOne();
            
            if (!user) {
                throw new BadRequestException();
            }

            return user;

        } catch(error) {
            console.log(error);
        }
    }

    public async getUserBy({
        key, value
    }: {
        key: keyof UsersDTO;
        value: any;
    }): Promise<UsersEntity> {
        try {
            const user: UsersEntity = await this.usersRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where({ [key]: value })
                .getOne();

            return user;

        } catch(error) {
            throw new BadRequestException();
        }
    }
}
