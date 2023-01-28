import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { TaskNotFoundException } from './error/task-not-found.error';
import { TaskAlreadyExistsException } from './error/task-already-exists.error';

type TaskData = {
  id: string;
  name: string;
};

@Injectable()
export class TaskService {
  private taskData: TaskData[];

  constructor() {
    this.taskData = [
      {
        id: randomUUID(),
        name: 'Make a cake',
      },
      {
        id: randomUUID(),
        name: 'Make two cakes',
      },
      {
        id: randomUUID(),
        name: 'Make three cakes',
      },
    ];
    console.log(this.taskData);
  }

  createTask(dto: CreateTaskDTO) {
    const taskFound = this.taskData.find((task) => task.name === dto.name);
    if (taskFound) {
      throw new TaskAlreadyExistsException('name');
    }
    const task = {
      id: randomUUID(),
      name: dto.name,
    };
    this.taskData.push(task);
    return task;
  }

  getTaskById(taskId: string) {
    const taskFound = this.taskData.find((task) => task.id === taskId);
    if (!taskFound) {
      throw new TaskNotFoundException();
    }
    return { ...taskFound };
  }

  getAllTasks() {
    return [...this.taskData];
  }

  updateTask(taskId: string, dto: UpdateTaskDTO) {
    const taskIndex = this.taskData.findIndex((task) => task.id === taskId);
    if (taskIndex < 0) {
      throw new TaskNotFoundException();
    }
    this.taskData[taskIndex] = {
      ...this.taskData[taskIndex],
      ...dto,
    };
    return dto;
  }

  deleteTask(taskId: string) {
    const newTasks = this.taskData.filter((task) => task.id !== taskId);
    if (newTasks.length === this.taskData.length) {
      throw new TaskNotFoundException();
    }
    this.taskData = newTasks;
  }
}
