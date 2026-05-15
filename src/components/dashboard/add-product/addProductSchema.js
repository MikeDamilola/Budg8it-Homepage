import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'application/pdf',
]

const MAX_FILE_SIZE = 15 * 1024 * 1024

export const addProductSchema = z.object({
  productName: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(120, 'Product name is too long'),
  price: z.coerce
    .number({ invalid_type_error: 'Enter a valid price' })
    .min(0, 'Price cannot be negative'),
  stocksQuantity: z.coerce
    .number({ invalid_type_error: 'Enter a valid quantity' })
    .int('Quantity must be a whole number')
    .min(1, 'Stock quantity must be at least 1'),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Unsupported file format'
    )
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, 'File must be under 15MB'),
})
