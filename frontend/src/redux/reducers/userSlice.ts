import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setMaxListeners } from "events";

const BASE_URL = 'http://localhost:5000/api/v1';

interface IState {
    userList: IUser[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

interface IUser {
    _id: string,
    uId: number,
    username: string,
    phone: string,
    email: string,
}

const initialState: IState = {
    userList: [],
    status: 'idle',
    error: null
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (endpoint: string) => {
    try {
        const response = await axios.get(endpoint);
        console.log(response)
        return [...response.data]
    } catch (err: any) {
        return err.message;
    }
});

export const addNewUser = createAsyncThunk('users/addNewUser', async (initialUser: {
    uId: number,
    username: string,
    phone: string,
    email: string
}) => {
    const response = await axios.post(BASE_URL + '/users', initialUser);
    return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: IUser) => {
    const response = await axios.put(`${BASE_URL}/users/${user._id}`, {
        uId: user.uId,
        username: user.username,
        phone: user.phone,
        email: user.email
    });
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (user: {_id: string}) => {

    const response = await axios.delete(`${BASE_URL}/users/${user._id}`)
    if (response?.status === 200) return response.data;
    return `${response?.status}: ${response?.statusText}`;
})

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.userList.push(action.payload);
        },
        updateUser: (state, action) => {
            const { uId, username, phone, email } = action.payload;
            const user = state.userList.find((user) => user.uId === +uId);
            console.log(user)
            if (user) {
                user.username = username;
                user.phone = phone;
                user.email = email;
            }
        },
        deleteUser: (state, action) => {
            const { _id } = action.payload;
            return {
                status: state.status,
                userList: state.userList.filter(user => user._id !== _id),
                error: state.error,
            };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userList = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || ''
            })
            .addCase(addNewUser.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userList.push(action.payload);
            })
            .addCase(addNewUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || ''
            })
            .addCase(updateUser.pending, (state, action)=>{
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action)=>{
                state.status='succeeded';
                const index = state.userList.findIndex((user) => user._id === action.payload._id);
                if (index !== -1) {
                    state.userList[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || ''
            })
            .addCase(deleteUser.pending, (state, action)=>{
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action)=>{
                state.status='succeeded';
                console.log('---', action)
                state.userList = state.userList.filter(user=>user._id !== action.payload._id)
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || ''
            })
    }
});

// export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;