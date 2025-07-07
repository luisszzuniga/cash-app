import mitt from 'mitt'

// Types d'événements disponibles
type Events = {
  'reload-accounts': void
  // Ajouter d'autres événements ici au besoin
}

// Créer l'instance mitt
const emitter = mitt<Events>()

// Composable pour émettre des événements
export const useEvents = () => {
  const emit = (event: keyof Events, data?: any) => {
    emitter.emit(event, data)
  }

  const on = (event: keyof Events, handler: (data?: any) => void) => {
    emitter.on(event, handler)
  }

  const off = (event: keyof Events, handler: (data?: any) => void) => {
    emitter.off(event, handler)
  }

  return {
    emit,
    on,
    off
  }
} 