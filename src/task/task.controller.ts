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
  createTask(@Body() createTaskDTO: CreateTaskDTO) {
    try {
      return this.taskService.createTask(createTaskDTO);
    } catch (err) {
      if (err instanceof TaskAlreadyExistsException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }

  @Get(':id')
  getTaskById(@Param('id', ParseUUIDPipe) taskId: string) {
    try {
      return this.taskService.getTaskById(taskId);
    } catch (err) {
      if (err instanceof TaskNotFoundException) {
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
      throw new InternalServerErrorException('server error');
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateTask(
    @Param('id', ParseUUIDPipe) taskId: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ) {
    try {
      this.taskService.updateTask(taskId, updateTaskDTO);
    } catch (err) {
      if (err instanceof TaskNotFoundException) {
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
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('server error');
    }
  }
}
