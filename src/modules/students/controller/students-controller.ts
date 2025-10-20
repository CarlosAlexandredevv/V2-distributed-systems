import type { Request, Response } from 'express';
import { CreateStudentUseCase } from '../useCases/create-student.usecase.js';
import { CreateStudentDto } from '../dtos/create-student.dto.js';

export class StudentsController {
  constructor(private readonly createStudentUseCase: CreateStudentUseCase) {}

  async create(req: Request, res: Response) {
    const validatedData = CreateStudentDto.parse(req.body);
    const result = await this.createStudentUseCase.execute(validatedData);
    res.status(201).json(result);
  }
}
