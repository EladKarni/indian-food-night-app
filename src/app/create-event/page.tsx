import ProtectedRoute from '@/components/ProtectedRoute'
import CreateEventContent from './CreateEventContent'

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <CreateEventContent />
    </ProtectedRoute>
  )
}