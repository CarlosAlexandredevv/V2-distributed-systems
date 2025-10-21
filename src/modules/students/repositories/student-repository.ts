import { PrismaClient, Prisma } from '../../../generated/prisma/index.js';
import type { Student } from '../../../generated/prisma/index.js';
import type { UpdateStudentByIdDto } from '../dtos/update-student.dto.js';

export class StudentRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(student: Prisma.StudentCreateInput): Promise<Student> {
    return this.prisma.student.create({
      data: student,
    });
  }

  async findAll(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }

  async findById(id: string): Promise<Student | null> {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    return student;
  }

  async updateById(id: string, student: UpdateStudentByIdDto): Promise<void> {
    await this.prisma.student.update({
      where: { id },
      data: student,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.student.delete({
      where: { id },
    });
  }
}
