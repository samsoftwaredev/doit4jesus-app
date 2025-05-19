import { Button } from '@mui/material';
import Link from 'next/link';

import { ForgotPassword, LogIn, SignUp } from '@/components/Sections';

import { NAV_MAIN_LINKS } from './nav';

export const pageView = {
  en: {
    signUp: {
      title: 'Sing Up',
      header: 'Join Our Catholic Community!',
      component: <SignUp />,
      footer: (
        <>
          Have an account already?
          <Link passHref href={NAV_MAIN_LINKS.login.link}>
            <Button>Log In</Button>
          </Link>
        </>
      ),
    },
    logIn: {
      title: 'Log In',
      header: 'Welcome back!',
      component: <LogIn />,
      footer: (
        <>
          Don&apos;t have an account?
          <Link passHref href={NAV_MAIN_LINKS.signup.link}>
            <Button>Sign Up</Button>
          </Link>
        </>
      ),
    },
    forgotPassword: {
      title: 'Forgot Password',
      header: '',
      component: <ForgotPassword />,
      footer: (
        <>
          Did you remembered your password?
          <Link passHref href={NAV_MAIN_LINKS.login.link}>
            <Button>Log In</Button>
          </Link>
        </>
      ),
    },
  },
  es: {
    signUp: {
      title: 'Registrarse',
      header: '¡Únete a nuestra comunidad católica!',
      component: <SignUp />,
      footer: (
        <>
          ¿Ya tienes una cuenta?
          <Link passHref href={NAV_MAIN_LINKS.login.link}>
            <Button>Iniciar sesión</Button>
          </Link>
        </>
      ),
    },
    logIn: {
      title: 'Iniciar sesión',
      header: '¡Bienvenido de nuevo!',
      component: <LogIn />,
      footer: (
        <>
          ¿No tienes una cuenta?
          <Link passHref href={NAV_MAIN_LINKS.signup.link}>
            <Button>Registrarse</Button>
          </Link>
        </>
      ),
    },
    forgotPassword: {
      title: 'Olvidé mi contraseña',
      header: '',
      component: <ForgotPassword />,
      footer: (
        <>
          ¿Recordaste tu contraseña?
          <Link passHref href={NAV_MAIN_LINKS.login.link}>
            <Button>Iniciar sesión</Button>
          </Link>
        </>
      ),
    },
  },
};
