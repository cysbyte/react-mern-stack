import Joi, { ObjectSchema } from '@hapi/joi';

export const userSchema: ObjectSchema = Joi.object().keys({
  uId: Joi.number().required().messages({
    'string.base': 'Id must be of type string',
    'string.empty': 'Id is a required field'
  }),
  username: Joi.string().required().min(4).max(20).messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is a required field'
  }),
  phone: Joi.string().required().min(7).max(15).messages({
    'string.base': 'Phone must be of type string',
    'string.min': 'Phone must be more than 7 characters',
    'string.max': 'Phone must be less than 15 characters',
    'string.empty': 'Password is a required field'
  }),
  email: Joi.string().required().lowercase().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email is a required field'
  }),
});
