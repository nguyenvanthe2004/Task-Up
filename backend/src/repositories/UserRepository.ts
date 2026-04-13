import { Service } from "typedi";
import { CreateUserInput, UpdateProfileInput } from "../types/user";
import User from "../models/User";

@Service()
export class UserRepository {
  async countAll() {
    return await User.count();
  }

  async findAll(skip: number, limit: number) {
    return await User.findAll({
      offset: skip,
      limit,
      raw: true,
    });
  }

  async findOne(id: number) {
    return await User.findByPk(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async findByCode(code: string) {
    return await User.findOne({ where: { verifyCode: code } });
  }

  async create(data: CreateUserInput) {
    return await User.create(data);
  }

  async update(id: number, data: Partial<User>) {
    await User.update(data, {
      where: { id }
    });

    return await User.findByPk(id);
  }
}