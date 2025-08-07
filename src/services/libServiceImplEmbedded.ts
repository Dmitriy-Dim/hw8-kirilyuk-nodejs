import {LibService} from "./libService.ts";
import {Book, BookGenres} from "../model/Book.ts";

export class LibServiceImplEmbedded implements LibService{
    private books: Book[] = [];

    addBook(book: Book): boolean {
        console.log("book")
        const index = this.books.findIndex(item => item.id === book.id )
        if(index === -1) {this.books.push(book);
            return true;}
        return false;
    }

    getAllBooks(): Book[] {
        return [...this.books];
    }

    getBooksByGenre(genre: BookGenres): Book[] {
        return [];
    }

    pickUpBook(id: string, reader: string): void {
    }

    removeBook(id: string): Book {
        throw "";
    }

    returnBook(id: string): void {
    }

}