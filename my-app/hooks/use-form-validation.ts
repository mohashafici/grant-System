import { useState, useEffect } from 'react'

interface ValidationRules {
  [key: string]: (value: string) => string
}

interface FormData {
  [key: string]: string
}

interface UseFormValidationProps {
  initialData: FormData
  validationRules: ValidationRules
  onSubmit: (data: FormData) => void | Promise<void>
}

export function useFormValidation({ initialData, validationRules, onSubmit }: UseFormValidationProps) {
  const [formData, setFormData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(false)

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    if (validationRules[name]) {
      return validationRules[name](value)
    }
    return ""
  }

  // Real-time validation
  useEffect(() => {
    Object.keys(touched).forEach(field => {
      if (touched[field]) {
        const error = validateField(field, formData[field])
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    })
  }, [formData, touched, validationRules])

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Check if form is valid
  const isFormValid = (): boolean => {
    return Object.keys(validationRules).every(field => 
      !validateField(field, formData[field])
    )
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true
      return acc
    }, {} as { [key: string]: boolean })
    
    setTouched(allTouched)
    
    // Validate all fields
    const newErrors: { [key: string]: string } = {}
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    
    setErrors(newErrors)
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        await onSubmit(formData)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData(initialData)
    setErrors({})
    setTouched({})
    setLoading(false)
  }

  // Set specific field error
  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // Clear specific field error
  const clearFieldError = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  return {
    formData,
    errors,
    touched,
    loading,
    handleInputChange,
    handleBlur,
    handleSubmit,
    isFormValid,
    resetForm,
    setFieldError,
    clearFieldError,
    setFormData,
    setErrors,
    setLoading
  }
}

// Common validation rules
export const commonValidations = {
  required: (value: string) => value.trim() ? "" : "This field is required",
  
  email: (value: string) => {
    if (!value) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? "" : "Please enter a valid email address"
  },
  
  password: (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 8) return "Password must be at least 8 characters"
    if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter"
    if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter"
    if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number"
    if (!/(?=.*[@$!%*?&])/.test(value)) return "Password must contain at least one special character (@$!%*?&)"
    return ""
  },
  
  name: (value: string) => {
    if (!value) return "Name is required"
    if (value.length < 2) return "Name must be at least 2 characters"
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces"
    return ""
  },
  
  minLength: (min: number) => (value: string) => {
    if (!value) return "This field is required"
    return value.length >= min ? "" : `Must be at least ${min} characters`
  },
  
  maxLength: (max: number) => (value: string) => {
    if (!value) return ""
    return value.length <= max ? "" : `Must be no more than ${max} characters`
  },
  
  number: (value: string) => {
    if (!value) return "This field is required"
    return !isNaN(Number(value)) ? "" : "Must be a valid number"
  },
  
  positiveNumber: (value: string) => {
    if (!value) return "This field is required"
    const num = Number(value)
    return !isNaN(num) && num > 0 ? "" : "Must be a positive number"
  }
} 