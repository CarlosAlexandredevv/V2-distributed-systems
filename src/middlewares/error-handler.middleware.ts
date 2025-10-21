import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ErrorHandlerMiddleware {
  static handle(error: Error, req: Request, res: Response, next: NextFunction) {
    // Verificar se a resposta já foi enviada
    if (res.headersSent) {
      return next(error);
    }

    console.error('Error caught by middleware:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    // Tratar erros de validação do Zod
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      });
    }

    // Tratar erros de sintaxe JSON
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Request body contains invalid JSON',
      });
    }

    // Tratar erros de cast do Mongoose (se estiver usando)
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'The provided ID is not valid',
      });
    }

    // Tratar erros de duplicação (se estiver usando banco de dados)
    if (error.name === 'MongoError' && (error as any).code === 11000) {
      return res.status(409).json({
        error: 'Duplicate entry',
        message: 'A record with this information already exists',
      });
    }

    // Tratar erros de validação do banco de dados
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
      });
    }

    // Tratar erro de estudante não encontrado
    if (error.message.includes('Student not found')) {
      return res.status(404).json({
        error: 'Student not found',
        message: 'The requested student does not exist',
      });
    }

    // Tratar outros erros conhecidos
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Something went wrong',
      });
    }

    // Tratar erros desconhecidos
    res.status(500).json({
      error: 'Unknown error occurred',
      message: 'Something went wrong',
    });
  }
}
