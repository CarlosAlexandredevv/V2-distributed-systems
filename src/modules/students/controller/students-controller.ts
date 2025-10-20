import type { Request, Response } from 'express';
import { CreateStudentUseCase } from '../useCases/create-student.usecase.js';
import { CreateStudentDto } from '../dtos/create-student.dto.js';
import { ListAllStudentsUseCase } from '../useCases/list-all-students.usecase.js';

export class StudentsController {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly listAllStudentsUseCase: ListAllStudentsUseCase,
  ) {}

  async create(req: Request, res: Response) {
    const validatedData = CreateStudentDto.parse(req.body);
    const result = await this.createStudentUseCase.execute(validatedData);
    res.status(201).json(result);
  }

  async listAll(req: Request, res: Response) {
    const result = await this.listAllStudentsUseCase.execute();
    res.status(200).json(result);
  }
}
