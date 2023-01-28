import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { TaskAlreadyExistsException } from './error/task-already-exists.error';
import { TaskNotFoundException } from './error/task-not-found.error';
import { TaskService } from './task.service';

@Controller('api/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() dto: CreateTaskDTO) {
    try {
      return this.taskService.createTask(dto);
    } catch (err) {
      console.log(err);
      if (err instanceof TaskAlreadyExistsException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Get('name/:name')
  getTaskByName(@Param('name') taskName: string) {
    try {
      return this.taskService.getTaskByName(taskName);
    } catch (err) {
      if (err instanceof TaskNotFoundException) {
        console.log(err);
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Get()
  getAllTasks() {
    try {
      return this.taskService.getAllTasks();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('server error');
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskDTO,
  ) {
    try {
      this.taskService.updateTask(taskId, dto);
    } catch (err) {
      if (err instanceof TaskNotFoundException) {
        console.log(err);
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Param('id', ParseUUIDPipe) taskId: string) {
    try {
      this.taskService.deleteTask(taskId);
    } catch (err) {
      if (err instanceof TaskNotFoundException) {
        console.log(err);
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }
}
