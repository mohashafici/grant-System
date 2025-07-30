import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  error?: string
  className?: string
}

export function FormError({ error, className = "" }: FormErrorProps) {
  if (!error) return null

  return (
    <div className={`flex items-center gap-1 mt-1 text-red-500 text-sm ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  )
}

interface FormErrorsProps {
  errors: { [key: string]: string }
  touched: { [key: string]: boolean }
  field: string
  className?: string
}

export function FormErrors({ errors, touched, field, className = "" }: FormErrorsProps) {
  const error = errors[field]
  const isTouched = touched[field]

  if (!error || !isTouched) return null

  return <FormError error={error} className={className} />
} 