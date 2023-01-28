export class TaskAlreadyExistsException extends Error {
  constructor(attribute: string) {
    const message = `task already exists with ${attribute}`;
    super(message);
    this.name = 'TaskAlreadyExists';
  }
}
