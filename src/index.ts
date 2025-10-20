import express, { type Request, type Response } from 'express';
import { StudentsController } from './modules/students/controller/students-controller.js';
import { CreateStudentUseCase } from './modules/students/useCases/create-student.usecase.js';
import { StudentRepository } from './modules/students/repositories/student-repository.js';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import { AsyncHandlerMiddleware } from './middlewares/async-handler.middleware.js';

const studentRepository = new StudentRepository();
const createStudentUseCase = new CreateStudentUseCase(studentRepository);
const studentsController = new StudentsController(createStudentUseCase);

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.post(
  '/students',
  AsyncHandlerMiddleware.wrap((req: Request, res: Response) =>
    studentsController.create(req, res),
  ),
);

app.use(ErrorHandlerMiddleware.handle);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
