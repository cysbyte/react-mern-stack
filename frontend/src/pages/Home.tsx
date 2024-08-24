import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, IRootState } from '../redux/store'
import { Link } from 'react-router-dom';
import { deleteUser, fetchUsers } from '../redux/reducers/userSlice';
import '../sass/styles.scss';

const Home = () => {
    const { userList, status, error } = useSelector((state: IRootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = (_id: string) => {
        try {
            console.log(_id);
            dispatch(deleteUser({_id: _id}));
            
        } catch (err) {
            console.error('Failed to delete the user', err);
        } 
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers('http://localhost:5000/api/v1/users'))
        }
    }, [dispatch])

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error: {error}</div>;

    console.log(userList)

    return (
        <div className='home-container'>
            <div className='home-header'>
            <h2>User Dashboard</h2>
            <Link className='submit' to='/create'>Create +</Link>   
            </div>

            <table className='styled-table'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userList && userList.map((user, index) => (
                            <tr key={index}>
                                <td>{user.uId}</td>
                                <td>{user.username}</td>
                                <td>{user.phone}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link className='operation-button' to={`/edit/${user._id}`}>Edit</Link>
                                </td>
                                <td>
                                    <button className='operation-button' onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Home