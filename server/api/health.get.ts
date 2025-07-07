export default defineEventHandler(async (event) => {
  try {
    // Vérifier la connexion à la base de données
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    // Test simple de connexion
    await prisma.$queryRaw`SELECT 1`
    await prisma.$disconnect()
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
  } catch (error) {
    console.error('Health check failed:', error)
    
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}) 