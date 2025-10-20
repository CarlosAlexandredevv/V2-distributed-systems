import { PrismaClient, Prisma } from '../../../generated/prisma/index.js';
import type { Student } from '../../../generated/prisma/index.js';

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
}
