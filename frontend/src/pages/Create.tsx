import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewUser } from '../redux/reducers/userSlice';
import { AppDispatch, IRootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: IRootState) => state.users);

  const navigate = useNavigate();

  const canSave = [username, phone, email].every(Boolean) && addRequestStatus === 'idle';


  const handleSubmit = (event: FormEvent) => {
    if(!canSave) return;

    event.preventDefault();
    try {
      setAddRequestStatus('pending');
      dispatch(addNewUser({ uId: +users.userList[users.userList.length - 1].uId + 1, username, phone, email }));
      navigate('/');
    } catch (err) {
      console.error('Failed to save the user', err);
    } finally {
      setAddRequestStatus('idle');
    }
  }

  return (
    <div className='container'>
    <div className='form-container'>
      <h3>Add New User</h3>
      <form className='styled-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            name='username'
            placeholder='enter name'
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            name='phone'
            placeholder='enter phone number'
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name='email'
            placeholder='enter email'
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button className='submit'>Submit</button>
      </form>
    </div>
    </div>
  )
}

export default Create