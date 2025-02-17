import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';

const router: Router = Router();

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('El nombre es requerido.'),
  body('password')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('El password es muy corto, mínimo 8 caracteres.'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los passwords no son iguales.');
    }
    return true;
  }),
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  '/confirm-account',
  body('token').notEmpty().withMessage('El token es requerido.'),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  '/login',
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  body('password')
    .notEmpty()
    .notEmpty()
    .withMessage('El password no puede ir vació.'),
  handleInputErrors,
  AuthController.login
);

router.post(
  '/request-code',
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  '/forgot-password',
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  '/validate-token',
  body('token').notEmpty().withMessage('El token es requerido.'),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  '/update-password/:token',
  param('token').isNumeric().withMessage('Token no valido.'),
  body('password')
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage('El password es muy corto, mínimo 8 caracteres.'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los passwords no son iguales.');
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get('/user', authenticate, AuthController.user);

export default router;
