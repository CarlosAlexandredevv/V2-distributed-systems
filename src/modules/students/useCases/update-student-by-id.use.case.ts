import { StudentRepository } from '../repositories/student-repository.js';
import type { Student } from '../../../generated/prisma/index.js';
import type { UpdateStudentByIdDto } from '../dtos/update-student.dto.js';

export class UpdateStudentByIdUseCase {
  constructor(private readonly repo: StudentRepository) {}

  async execute(
    id: string,
    student: UpdateStudentByIdDto,
  ): Promise<{ message: string }> {
    try {
      const existingStudent = await this.repo.findById(id);

      if (!existingStudent) {
        throw new Error('Student not found');
      }

      await this.repo.updateById(id, student);

      return { message: 'Student updated successfully' };
    } catch (error) {
      throw new Error(`Failed to update student by id: ${error}`);
    }
  }
}
