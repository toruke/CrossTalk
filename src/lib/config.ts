// Configuration centralisée de l'application

export const config = {
  // URL de l'API backend
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  
  // URL de l'application
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Environnement
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
};
