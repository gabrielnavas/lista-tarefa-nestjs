export class TaskNotFoundException extends Error {
  constructor() {
    const message = 'task not found';
    super(message);
    this.name = 'TaskNotFoundException';
  }
}
