import { StudentRepository } from '../repositories/student-repository.js';
import type { Student } from '../../../generated/prisma/index.js';

export class ListAllStudentsUseCase {
  constructor(private readonly repo: StudentRepository) {}

  async execute(): Promise<Student[]> {
    return this.repo.findAll();
  }
}
