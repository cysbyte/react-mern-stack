import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { AppDispatch, IRootState } from '../redux/store';
import { updateUser } from '../redux/reducers/userSlice';

const Edit = () => {
  const { userId } = useParams();
  const users = useSelector((state: IRootState) => state.users);
  const currentUser = users.userList.find(user => user._id === userId!);

  const [uId, setUId] = useState(currentUser?.uId);
  const [username, setUsername] = useState(currentUser?.username);
  const [phone, setPhone] = useState(currentUser?.phone);
  const [email, setEmail] = useState(currentUser?.email);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(updateUser({
      _id: userId!,
      uId: uId!,
      username: username!,
      phone: phone!,
      email: email!,
    }));
    navigate('/');
  }
  return (
    <div className='container'>
    <div className='form-container'>
      <h3>Edit User</h3>
      <form className='styled-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="uId">Id:</label>
          <input
            type="text"
            name='uId'
            value={uId}
            onChange={e => setUId(+e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            name='username'
            placeholder='enter name'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            name='phone'
            placeholder='enter phone number'
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name='email'
            placeholder='enter email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button className='submit'>Update</button>
      </form>
    </div>
    </div>
  )
}

export default Edit