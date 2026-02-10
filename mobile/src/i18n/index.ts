import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome',
        login: 'Login',
        register: 'Register',
        save: 'Save',
        cancel: 'Cancel',
      },
      tabs: {
        explore: 'Explore',
        courses: 'My Courses',
        assignments: 'Assignments',
        profile: 'Profile',
      },
      courses: {
        explore: 'Explore Courses',
        myCourses: 'My Courses',
        noCourses: 'No courses found',
      },
    },
  },
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido',
        login: 'Iniciar sesión',
        register: 'Registrarse',
        save: 'Guardar',
        cancel: 'Cancelar',
      },
      tabs: {
        explore: 'Explorar',
        courses: 'Mis Cursos',
        assignments: 'Tareas',
        profile: 'Perfil',
      },
      courses: {
        explore: 'Explorar Cursos',
        myCourses: 'Mis Cursos',
        noCourses: 'No se encontraron cursos',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode ?? 'en', // Use device locale
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
