import { StudentRepository } from '../repositories/student-repository.js';
import type { CreateStudentDto } from '../dtos/create-student.dto.js';

export class CreateStudentUseCase {
  constructor(private readonly repo: StudentRepository) {}

  async execute(student: CreateStudentDto): Promise<{ message: string }> {
    try {
      await this.repo.create(student);
      return { message: 'Student created successfully' };
    } catch (error) {
      throw new Error(`Failed to create student: ${error}`);
    }
  }
}
