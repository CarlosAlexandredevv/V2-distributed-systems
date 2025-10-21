import type { Request, Response } from 'express';
import { CreateStudentUseCase } from '../useCases/create-student.usecase.js';
import { CreateStudentDto } from '../dtos/create-student.dto.js';
import { ListAllStudentsUseCase } from '../useCases/list-all-students.usecase.js';
import { UpdateStudentByIdDto } from '../dtos/update-student.dto.js';
import { UpdateStudentByIdUseCase } from '../useCases/update-student-by-id.use.case.js';

export class StudentsController {
  constructor(
    private readonly createStudentUseCase: CreateStudentUseCase,
    private readonly listAllStudentsUseCase: ListAllStudentsUseCase,
    private readonly updateStudentByIdUseCase: UpdateStudentByIdUseCase,
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

  async updateById(req: Request, res: Response) {
    const { id } = req.params;

    const validatedData = UpdateStudentByIdDto.parse(req.body);
    const result = await this.updateStudentByIdUseCase.execute(
      id as string,
      validatedData,
    );
    res.status(200).json(result);
  }
}
