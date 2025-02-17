import type { Request, Response } from 'express';

import User from '../models/User';
import Token from '../models/Token';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevenir duplicados
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('El usuario ya esta registrado.');
        res.status(409).json({ error: error.message });
        return;
      }

      const user = new User(req.body);

      // Hash password
      user.password = await hashPassword(password);

      // Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send('Cuenta creada, revisa tu email para confirmarla.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error('Token no valido');
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send('Cuenta confirmada correctamente.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error('Usuario no encontrado.');
        res.status(404).json({ error: error.message });
        return;
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // Send email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          'La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación.'
        );
        res.status(401).json({ error: error.message });
        return;
      }

      // Review password
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto.');
        res.status(401).json({ error: error.message });
        return;
      }

      const token = generateJWT({ id: user.id });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // User exists
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('El usuario no es ta registrado.');
        res.status(409).json({ error: error.message });
        return;
      }

      if (user.confirmed) {
        const error = new Error('El usuario ya esta confirmado.');
        res.status(403).json({ error: error.message });
        return;
      }

      // Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send('Se envió un nuevo token a tu e-mail.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // User exists
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('El usuario no es ta registrado.');
        res.status(409).json({ error: error.message });
        return;
      }

      // Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      // Send email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send('Revisa tu e-mail para instrucciones.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error('Token no valido');
        res.status(404).json({ error: error.message });
        return;
      }

      res.send('Token valido, define tu nueva contraseña.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error('Token no valido');
        res.status(404).json({ error: error.message });
        return;
      }

      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(req.body.password);

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send('Las contraseña se modifico correctamente.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revisa los logs.' });
    }
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
  };
}
