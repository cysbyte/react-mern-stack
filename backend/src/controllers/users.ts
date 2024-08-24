import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import UserModel from '../models/user';
import { userSchema } from '../schemas/user'

export const getUsers: RequestHandler = async (req, res, next) => {
    try {
        // throw createHttpError(401);
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, 'Invalid user id');
        }
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            throw createHttpError(404, 'User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface CreateUserBody {
    uId: string,
    username?: string,
    email?: string,
    phone?: string,
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {

    try {
        
        const result = await userSchema.validateAsync(req.body);
        const doesExist = await UserModel.findOne({email: result.email});
        if(doesExist){
            throw createHttpError(`${result.email} already exists.`);
        }
        const {uId, username, email, phone } = result;
        const newUser = await UserModel.create({
            uId: uId,
            username: username,
            email: email,
            phone: phone,
        });
        res.status(201).json(newUser);
    } catch (error: any) {
        if(error.isJoi && error.isJoi === true) {
            error.status = 422;
        }
        next(error);
    }
}

interface UpdateUserParams {
    userId: string,
}

interface UpdateUserBody {
    uId: string,
    username: string,
    phone: string,
    email: string
}

export const updateUser: RequestHandler<
    UpdateUserParams,
    unknown,
    UpdateUserBody,
    unknown> = async (req, res, next) => {
        const userId = req.params.userId;
        try {
            if (!mongoose.isValidObjectId(userId)) {
                throw createHttpError(400, 'Invalid user id');
            }
            const result = await userSchema.validateAsync(req.body);
            
            const user = await UserModel.findById(userId).exec();
            if (!user) {
                throw createHttpError(404, 'user not found');
            }

            const {uId, username, email, phone } = result;

            user.uId = uId;
            user.username = username;
            user.email = email;
            user.phone = phone;

            const updatedUser = await user.save();
            res.status(200).json(updatedUser);
        } catch (error: any) {
            if(error.isJoi && error.isJoi === true) {
                error.status = 422;
            }
            next(error);
        }
    }

export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, 'Invalid note id');
        }
        // const note = await NoteModel.findById(userId).exec();
        //     if (!note) {
        //         throw createHttpError(404, 'Note not found');
        //     }
        const user = await UserModel.findByIdAndDelete(userId);
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}