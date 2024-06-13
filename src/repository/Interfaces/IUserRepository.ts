import { UserDto } from '../../dto/UserDto'

/**
 * This interface defines the contract for a repository dealing with user data. 
 */
export interface IUserRepository {
  /**
   * Retrieves a paginated list of users.
   * @param page Optional page number for pagination.
   * @param limit Optional limit of users per page for pagination.
   * @returns A promise that resolves with an array of UserDto objects.
   */
  getUsers(page?: number, limit?: number): Promise<UserDto[]>;

  /**
   * Retrieves a single user by their email address.
   * @param email The email address of the user to retrieve.
   * @returns A promise that resolves with a UserDto object if found, otherwise null.
   */
  getUserByEmail(email: string): Promise<UserDto | null>;

  /**
   * Retrieves a single user by their email address, including the user's password.
   * @param email The email address of the user to retrieve.
   * @returns A promise that resolves with a UserDto object if found, otherwise null.
   */
  getUserByEmailWithPassword(email: string): Promise<UserDto | null>;

  /**
   * Retrieves a single user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves with a UserDto object if found, otherwise null.
   */
  getUserById(id: string): Promise<UserDto | null>;

  /**
   * Creates a new user with the provided values.
   * @param value A record containing the values for the new user.
   * @returns A promise that resolves with the created UserDto object.
   */
  createUser(value: Record<string, any>): Promise<UserDto>;

  /**
   * Deletes a user by their ID.
   * @param id The ID of the user to delete.
   * @returns A promise that resolves with the deleted UserDto object.
   */
  deleteUserById(id: string): Promise<UserDto>;

  /**
   * Updates a user by their ID with the provided values.
   * @param id The ID of the user to update.
   * @param values A record containing the values to update the user with.
   * @returns A promise that resolves with the updated UserDto object.
   */
  updateUserById(id: string, values: Record<string, any>): Promise<UserDto>;
}
