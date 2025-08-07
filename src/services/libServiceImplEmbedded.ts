import {LibService} from "./libService.ts";
import {Book, BookGenres, BookStatus} from "../model/Book.ts";
import {HttpError} from "../errorHandler/HttpError.ts";

export class LibServiceImplEmbedded implements LibService{
    private books: Book[] = [];

    addBook(book: Book): boolean {
        const index = this.books.findIndex(item => item.id === book.id)
        if(index === -1) {
            this.books.push(book);
            return true;
        }
        return false;
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBooksByGenre(genre: BookGenres): Book[] {
        return this.books.filter(book => book.genre === genre);
    }

    removeBook(id: string): Book {
        const book = this.books.find(item => item.id === id);
        if(!book) throw new HttpError(404, 'Book not found');

        if(book.status === BookStatus.ON_HAND) {
            throw new HttpError(409, 'Cannot remove book that is currently borrowed');
        }

        book.status = BookStatus.REMOVED;
        return book;
    }

    pickUpBook(id: string, reader: string): void {
        const book = this.books.find(item => item.id === id);
        if(!book) throw new HttpError(404, 'Book not found');

        if(book.status === BookStatus.ON_HAND) {
            throw new HttpError(409, 'Book is already borrowed');
        }

        if(book.status === BookStatus.REMOVED) {
            throw new HttpError(409, 'Book is removed and cannot be borrowed');
        }

        const currentDate = new Date().toISOString().split('T')[0];
        book.pickList.push({
            reader,
            pick_date: currentDate,
            return_date: null
        });

        book.status = BookStatus.ON_HAND;
    }

    returnBook(id: string): void {
        const book = this.books.find(item => item.id === id);
        if(!book) throw new HttpError(404, 'Book not found');

        if(book.status !== BookStatus.ON_HAND) {
            throw new HttpError(409, 'Book is not currently borrowed');
        }

        const lastPickRecord = book.pickList
            .filter(record => record.return_date === null)
            .pop();

        if(lastPickRecord) {
            const currentDate = new Date().toISOString().split('T')[0];
            lastPickRecord.return_date = currentDate;
        }

        book.status = BookStatus.ON_STOCK;
    }
}