import { Service } from "typedi";
import { Category } from "../models/Category";
import { CreateCategoryInput, UpdateCategoryInput } from "../types/category";

@Service()
export class CategoryRepository {
  async findById(id: number) {
    return await Category.findByPk(id);
  }

  async findAll(spaceId?: number) {
    const whereClause = spaceId !== undefined ? { spaceId } : {};
    return await Category.findAll({
      where: whereClause,
    });
  }

  async create(spaceId: number, data: CreateCategoryInput) {
    return await Category.create({ ...data, spaceId });
  }

  async update(id: number, data: UpdateCategoryInput) {
    await Category.update(data, {
      where: { id },
    });
    return await Category.findByPk(id);
  }

  async delete(id: number) {
    return await Category.destroy({
      where: { id },
    });
  }

  async countBySpace(spaceId: number) {
    return await Category.count({
      where: { spaceId },
    });
  }
}
