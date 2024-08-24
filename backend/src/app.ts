import 'dotenv/config';
import express, { NextFunction } from 'express';
import usersRoutes from './routes/users';
import { Request, Response } from 'express';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import env from './util/validateEnv';
import MongoStore from 'connect-mongo';
import Joi from '@hapi/joi';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(cors());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })

}))

app.use('/api/v1/users', usersRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found'));
})


app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = 'An unknown error occured';
    let statusCode = 500;

    if (error.isJoi) {
        // Joi validation error
        statusCode = 400;
        errorMessage= error.details.map((detail: Joi.ValidationErrorItem) => detail.message).join(', ')
    } 
    
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
    // if (error instanceof Error) {
    //     errorMessage = error.message;
    //     res.status(500).json({ error: errorMessage });
    // }
});

export default app;