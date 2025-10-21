import { StudentRepository } from '../repositories/student-repository.js';

export class DeleteStudentByIdUseCase {
  constructor(private readonly repo: StudentRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    try {
      const existingStudent = await this.repo.findById(id);

      if (!existingStudent) {
        throw new Error('Student not found');
      }

      await this.repo.deleteById(id);
      return { message: 'Student deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete student by id: ${error}`);
    }
  }
}
