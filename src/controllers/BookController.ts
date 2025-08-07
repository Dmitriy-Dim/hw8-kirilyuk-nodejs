import {Response, Request} from "express";
import {LibService} from "../services/libService.ts";
import {LibServiceImplEmbedded} from "../services/libServiceImplEmbedded.ts";
import {Book, BookDto, BookGenres} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";
import {convertBookDtoToBook} from "../utils/tools.ts";
import {bookDtoSchema, uuidSchema, readerSchema, genreParamSchema} from "../validation/schemas.ts";

export class BookController {
    private libService: LibService = new LibServiceImplEmbedded();

    getAllBooks(req: Request, res: Response) {
        const result = this.libService.getAllBooks();
        res.json(result);
    }

    addBook(req: Request, res: Response) {
        const {error, value} = bookDtoSchema.validate(req.body);
        if(error) throw new HttpError(400, error.details[0].message);

        const dto = value as BookDto;
        const quantity = dto.quantity || 1;
        const books: Book[] = [];

        for(let i = 0; i < quantity; i++) {
            const book: Book = convertBookDtoToBook(dto);
            const result = this.libService.addBook(book);
            if(result) books.push(book);
            else throw new HttpError(409, 'Book not added. Id conflict');
        }

        res.status(201).json(quantity === 1 ? books[0] : books);
    }

    removeBook(req: Request, res: Response) {
        const {error, value} = uuidSchema.validate(req.params.id);
        if(error) throw new HttpError(400, 'Invalid book ID');

        const result = this.libService.removeBook(value);
        res.json(result);
    }

    pickUpBook(req: Request, res: Response) {
        const idValidation = uuidSchema.validate(req.params.id);
        if(idValidation.error) throw new HttpError(400, 'Invalid book ID');

        const readerValidation = readerSchema.validate(req.query.reader);
        if(readerValidation.error) throw new HttpError(400, 'Reader parameter is required');

        this.libService.pickUpBook(idValidation.value, readerValidation.value);
        res.json({message: 'Book picked up successfully'});
    }

    returnBook(req: Request, res: Response) {
        const {error, value} = uuidSchema.validate(req.params.id);
        if(error) throw new HttpError(400, 'Invalid book ID');

        this.libService.returnBook(value);
        res.json({message: 'Book returned successfully'});
    }

    getBooksByGenre(req: Request, res: Response) {
        const {error, value} = genreParamSchema.validate(req.params.genre);
        if(error) throw new HttpError(400, 'Invalid genre');

        const result = this.libService.getBooksByGenre(value as BookGenres);
        res.json(result);
    }
}