import { User } from "@prisma/client";
import UserType, { UserDataCreateType } from "~/types/User";
import argon2 from "argon2";
import { prisma } from "~/db.server";
import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "~/constants.server";
import TokenType from "~/types/Token";

const mapPrismaUserToAppUser = (user: User): UserType => {
  const { password, ...userData } = user;
  return {
    ...userData,
    createdAt: user.createdAt.valueOf(),
    updatedAt: user.updatedAt.valueOf(),
  };
};

class UsersService {
  static async create(data: UserDataCreateType): Promise<UserType> {
    // TODO ajouter les vérifications de l'email et du username

    // Hash le mot de passe avant de l'enregistrer
    const hashedPassword = await argon2.hash(data.password);
    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return mapPrismaUserToAppUser(newUser);
  }

  static async getById(id: number): Promise<UserType> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("L'utilisateur n'existe pas");
    }

    return mapPrismaUserToAppUser(user);
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const payload: TokenType = { id: user.id, email: user.email };
    // Générer un token JWT
    return jwt.sign(
      payload,
      JWT_SECRET, // Clé secrète
      { expiresIn: JWT_EXPIRATION }, // Options
    );
  }
}

export default UsersService;
