import express, {Request, Response, NextFunction} from 'express';
import {BookController} from "../controllers/BookController.ts";

export const bookRouter = express.Router();

const controller = new BookController();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

bookRouter.get('/', asyncHandler((req: Request, res: Response) => {
    controller.getAllBooks(req, res);
}));

bookRouter.post('/', asyncHandler((req: Request, res: Response) => {
    controller.addBook(req, res);
}));

bookRouter.delete('/:id', asyncHandler((req: Request, res: Response) => {
    controller.removeBook(req, res);
}));

bookRouter.patch('/:id/pickup', asyncHandler((req: Request, res: Response) => {
    controller.pickUpBook(req, res);
}));

bookRouter.patch('/:id/return', asyncHandler((req: Request, res: Response) => {
    controller.returnBook(req, res);
}));

bookRouter.get('/genre/:genre', asyncHandler((req: Request, res: Response) => {
    controller.getBooksByGenre(req, res);
}));