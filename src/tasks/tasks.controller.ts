import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateTaskDto, @Request() req) {

        return this.tasksService.create(dto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.tasksService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.tasksService.findOne(+id, req.user);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req) {
        return this.tasksService.update(+id, dto, req.user);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.tasksService.remove(+id, req.user);
    }
}