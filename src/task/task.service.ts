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

  getTaskByName(taskName: string) {
    const taskFound = this.taskData.find((task) => task.name === taskName);
    if (!taskFound) {
      throw new TaskNotFoundException();
    }
    return { ...taskFound };
  }

  getAllTasks() {
    return [...this.taskData];
  }

  updateTask(taskId: string, dto: UpdateTaskDTO) {
    console.log(taskId, dto);
    console.log(this.taskData);

    const taskIndex = this.taskData.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new TaskNotFoundException();
    }
    if (
      this.taskData[taskIndex].name === dto.name &&
      this.taskData[taskIndex].id !== taskId
    ) {
      throw new TaskAlreadyExistsException('name');
    }
    this.taskData[taskIndex].name = dto.name;
    this.taskData[taskIndex];
  }

  deleteTask(taskId: string) {
    const newTasks = this.taskData.filter((task) => task.id !== taskId);
    if (newTasks.length === this.taskData.length) {
      throw new TaskNotFoundException();
    }
    this.taskData = newTasks;
  }
}
