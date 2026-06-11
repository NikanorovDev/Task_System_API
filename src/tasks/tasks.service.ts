import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(private prisma: PrismaService) { }

    async create(dto: CreateTaskDto, userId: number) {
        const task = await this.prisma.task.create({
            data: { ...dto, userId },
        });
        this.logger.log(`Task created: id=${task.id} by user=${userId}`);
        return task;
    }

    async findAll(user: any) {
        if (user.role === Role.ADMIN) {
            return this.prisma.task.findMany();
        }
        return this.prisma.task.findMany({ where: { userId: user.id } });
    }

    async findOne(id: number, user: any) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');

        if (user.role !== Role.ADMIN && task.userId !== user.id) {
            throw new ForbiddenException('You do not have permission to view this task');
        }
        return task;
    }

    async update(id: number, dto: UpdateTaskDto, user: any) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');

        if (user.role !== Role.ADMIN && task.userId !== user.id) {
            throw new ForbiddenException('You do not have permission to update this task');
        }

        return this.prisma.task.update({ where: { id }, data: dto });
    }

    async remove(id: number, user: any) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');

        if (user.role !== Role.ADMIN && task.userId !== user.id) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        await this.prisma.task.delete({ where: { id } });
        this.logger.log(`Task deleted: id=${id} by user=${user.id}`);
        return { message: 'Task deleted successfully' };
    }
}
