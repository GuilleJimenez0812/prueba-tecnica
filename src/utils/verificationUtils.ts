import { CustomError } from '../dto/customError'

export class VerificationUtils {
  validateParameters(parameters: Record<string, any>, expectedTypes: Record<string, string>): void {
    for (const [key, value] of Object.entries(parameters)) {
      const expectedType = expectedTypes[key]
      // Verificar si se espera un arreglo de un tipo específico
      if (expectedType.endsWith('[]')) {
        // Extraer el tipo de los elementos del arreglo
        const elementType = expectedType.slice(0, -2)
        if (!Array.isArray(value)) {
          throw new CustomError(`The data for ${key} is not an array.`, 400)
        }
        // Verificar que todos los elementos del arreglo sean del tipo esperado
        for (const item of value) {
          if (typeof item !== elementType) {
            throw new CustomError(`The data in ${key} does not match the format. Expected array of ${elementType}.`, 400)
          }
        }
      } else {
        // Verificación de tipos para valores no arreglo
        if (typeof value !== expectedType) {
          throw new CustomError(`The data for ${key} does not match the format. Expected ${expectedType}.`, 400)
        }
      }
    }
  }
}
