import { Router } from 'express';
import { body, param } from 'express-validator';

import { AuthController } from '@/controllers/AuthController';

import { authenticate } from '@/middlewares/auth';
import { handleInputErrors } from '@/middlewares/validation';

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

//* Get user indo
router.get('/user', authenticate, AuthController.user);

/** Profile **/
router.put(
  '/profile',
  authenticate,
  body('name').notEmpty().withMessage('El nombre es requerido.'),
  body('email').notEmpty().isEmail().withMessage('E-mail no valido.'),
  handleInputErrors,
  AuthController.updateProfile
);

router.put(
  '/update-password',
  authenticate,
  body('current_password')
    .notEmpty()
    .withMessage('El password actual no puede ir vació.'),
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
  AuthController.updateCurrentUserPassword
);

router.post(
  '/check-password',
  authenticate,
  body('password')
    .notEmpty()
    .withMessage('El password actual no puede ir vació.'),
  handleInputErrors,
  AuthController.checkPassword
);

export default router;
