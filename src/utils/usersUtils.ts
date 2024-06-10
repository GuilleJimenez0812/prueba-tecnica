import { v4 as uuidv4 } from 'uuid'

export class UsersUtils {
  generarUUID(): string {
    return uuidv4()
  }
}
