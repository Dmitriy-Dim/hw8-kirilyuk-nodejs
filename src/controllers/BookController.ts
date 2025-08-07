import {Response, Request} from "express";
import {LibService} from "../services/libService.ts";
import {LibServiceImplEmbedded} from "../services/libServiceImplEmbedded.ts";
import {Book, BookDto} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";
import {convertBookDtoToBook} from "../utils/tools.js";

export class BookController {
    private libService: LibService = new LibServiceImplEmbedded();

    getAllBooks(req:Request, res:Response){
        const result = this.libService.getAllBooks();
        res.json(result);
    }

    addBook(req:Request, res:Response){
        console.log('controller - addBook')
        const dto = req.body as BookDto;
        console.log(dto)
        const book:Book = convertBookDtoToBook(dto);

        const result = this.libService.addBook(book);
        console.log(result)
        if(result) res.status(201).json(book)
        else throw new HttpError(409, 'Book not added. Id conflict')
    }
}