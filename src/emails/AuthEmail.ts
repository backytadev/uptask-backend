import { transporter } from '../config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async ({ email, name, token }: IEmail) => {
    const info = await transporter.sendMail({
      from: 'UpTask <admin@uptask.com>',
      to: email,
      subject: 'UpTask - Confirma tu cuenta',
      text: 'UpTask - Confirma tu cuenta',
      html: `<p>Hola: ${name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes
      confirmar tu cuenta</p>
      <p>Visita el siguiente enlace: </p>
      <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
      <p>E ingresa el código: <b>${token}</b></p>
      <p>Este token expira en 10 minutos.</p>
      `,
    });

    console.log('Mensaje enviado', info.messageId);
  };

  static sendPasswordResetToken = async ({ email, name, token }: IEmail) => {
    const info = await transporter.sendMail({
      from: 'UpTask <admin@uptask.com>',
      to: email,
      subject: 'UpTask - Restablece tu password',
      text: 'UpTask - Restablece tu password',
      html: `<p>Hola: ${name}, has solicitado restablecer tu password.</p>
      <p>Visita el siguiente enlace: </p>
      <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablece Password</a>
      <p>E ingresa el código: <b>${token}</b></p>
      <p>Este token expira en 10 minutos.</p>
      `,
    });

    console.log('Mensaje enviado', info.messageId);
  };
}
