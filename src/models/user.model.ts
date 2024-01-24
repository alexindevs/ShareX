import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

class UserModel {
  /**
   * Adds a new user to the database.
   * @param {User} user - The user object to be added.
   * @return {Promise<User | null>} A promise that resolves to the newly created user object, or null if an error occurs.
   */
  async addUser() {}

  async getAllUsers() {}
}

export default UserModel;