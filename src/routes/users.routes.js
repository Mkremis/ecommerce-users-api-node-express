import { Router } from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { isUser } from '../middlewares/isUser.js';
import {
  login,
  updateUser,
  register,
  dashboard,
} from '../controllers/users.controller.js';

const router = Router();
router
  .post('/users/login', isUser, login)
  .get('/users/dashboard/:username', checkSession, dashboard)
  .post('/users/register', isUser, register)
  .put('/users/update', checkSession, updateUser);

export default router;
