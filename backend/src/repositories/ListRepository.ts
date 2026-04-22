import { Service } from "typedi";
import { List } from "../models/List";
import { CreateListInput, UpdateListInput } from "../types/list";
import { Category } from "../models";

@Service()
export class ListRepository {
  async findById(id: number) {
    return await List.findOne({
      where: { id }, 
      include: [
        {
          model: Category,
          as: "category", 
          attributes: ["id", "name", "description", "icon", "color", "spaceId"],
        }
      ]  
    });
  }

  async findAll(categoryId?: number) {
    const whereClause = categoryId !== undefined ? { categoryId } : {};
    return await List.findAll({
      where: whereClause,
    });
  }

  async create(categoryId: number, data: CreateListInput) {
    return await List.create({ ...data, categoryId });
  }

  async update(id: number, data: UpdateListInput) {
    await List.update(data, {
      where: { id },
    });
    return await List.findByPk(id);
  }

  async delete(id: number) {
    return await List.destroy({
      where: { id },
    });
  }

  async countBySpace(categoryId: number) {
    return await List.count({
      where: { categoryId },
    });
  }
}
