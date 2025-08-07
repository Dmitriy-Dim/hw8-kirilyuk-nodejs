import Joi from 'joi';
import {BookGenres} from "../model/Book.ts";

export const bookDtoSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().valid(...Object.values(BookGenres)).required(),
    quantity: Joi.number().integer().min(1).optional()
});

export const uuidSchema = Joi.string().uuid().required();

export const readerSchema = Joi.string().required();

export const genreParamSchema = Joi.string().valid(...Object.values(BookGenres)).required();