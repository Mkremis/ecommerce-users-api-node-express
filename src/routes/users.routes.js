import { Router } from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { isUser } from '../middlewares/isUser.js';
import {
  login,
  updateUser,
  register,
  dashboard,
  logout,
} from '../controllers/users.controller.js';

const router = Router();
router
  .post('/users/login', isUser, login)
  .post('/users/register', isUser, register)
  .get('/users/logout', checkSession, logout)
  .get('/users/dashboard/:username', checkSession, dashboard)
  .put('/users/update', checkSession, updateUser);

export default router;
