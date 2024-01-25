import { PrismaClient, User, RefreshToken } from '@prisma/client'
import IUser, { IRefreshToken } from '../interfaces/auth.interface';
import logger from '../utils/logging/logger';
const prisma = new PrismaClient()



class AuthRepository {
  // Create a new user in the database
   async createUser(user: IUser): Promise<User | null> {
    try {
      const newUser = await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage
        }
      })
      return newUser;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  // Retrieve a user by their ID
  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      })
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }  // Retrieve a user by their email

  async getPassword (email: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })
      if (!user) {
        return null;
      }
      return user.password;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  // Retrieve a user by their username
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username
        }
      })
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async updateUser(id: number, updatedUser: Partial<User>): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: {
          id
        },
        data: updatedUser
      })
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: {
          id
        }
      })
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async createRefreshToken(refreshToken: IRefreshToken): Promise<RefreshToken | null> {
    try {
      const newRefreshToken = await prisma.refreshToken.create({
        data: refreshToken
      })
      return newRefreshToken;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async getRefreshTokenByUserId(userId: number): Promise<RefreshToken | null> {
    try {
      const refreshToken = await prisma.refreshToken.findUnique({
        where: {
          userId
        }
      })
      return refreshToken;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async deleteRefreshTokenByUserId(userId: number): Promise<boolean> {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          userId
        }
      })
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
  async updateVerifToken(userId: number, verificationToken: string): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          verificationToken
        }
      })
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async revokeVerifToken(userId: number): Promise<boolean> {
    try {
      await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          verificationToken: null
        }
      })
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async replaceRefreshToken(userId: number, newRefreshToken: string): Promise<RefreshToken | null> {
    try {
      const formerToken = await prisma.refreshToken.findUnique({
        where: {
          userId
        }
      })
      if (!formerToken) {
        const newToken = await prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId
          }
        });
        return newToken;
      }
      const refreshToken = await prisma.refreshToken.update({
        where: {
          userId
        },
        data: {
          token: newRefreshToken,
        }
      })
      return refreshToken;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}

export default AuthRepository;