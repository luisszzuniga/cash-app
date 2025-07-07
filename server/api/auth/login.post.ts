import { PrismaClient } from '@prisma/client';
import { loginSchema } from '~/core/schemas/auth.schema';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validation des données avec Zod
    const validatedData = loginSchema.parse(body);
    
    // Recherche de l'utilisateur
    const user = await prisma.user.findFirst({
      where: { email: validatedData.email }
    });
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      });
    }
    
    // Création de la session avec nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: user.id.toString(),
        email: user.email
      },
      loggedInAt: new Date()
    });
    
    return {
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email
      }
    };
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      });
    }
    
    console.error('Erreur lors de la connexion:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    });
  }
}); 