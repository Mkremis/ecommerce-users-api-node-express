import { Router } from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { isUser } from '../middlewares/isUser.js';
import {
  login,
  updateUser,
  register,
  dashboard,
  logout,
  reloadSession,
} from '../controllers/users.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { loginSchema, registerSchema } from '../schemas/users.schema.js';

const router = Router();
router
  .post('/users/login', validateSchema(loginSchema), isUser, login)
  .post('/users/register', validateSchema(registerSchema), isUser, register)
  .get('/users/logout', checkSession, logout)
  .get('/users/dashboard', checkSession, dashboard)
  .put('/users/update', checkSession, updateUser)
  .get('/users/reload', checkSession, reloadSession);

export default router;
