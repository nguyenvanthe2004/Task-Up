import { Service } from "typedi";
import { CreateUserInput } from "../types/user";
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

  async findOne(id: string) {
    return await User.findByPk(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async findByCode(code: string) {
    return await User.findOne({ where: { verifyCode: code } });
  }

  async create(data: CreateUserInput, options?: any) {
    return await User.create(data, options);
  }

  async update(id: string, data: any, options?: any) {
    await User.update(data, {
      where: { id },
      ...options,
    });

    return await User.findByPk(id);
  }
}