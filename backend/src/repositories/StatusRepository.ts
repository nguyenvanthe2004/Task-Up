import { Service } from "typedi";
import { Status } from "../models";
import { CreateStatus, UpdateStatus } from "../types/status";


@Service()
export class StatusRepository {
  async findById(id: number) {
    return await Status.findByPk(id);
  }

  async findAll() {
    return await Status.findAll({
      order: [["createdAt", "ASC"]],
    });
  }

  async create(data: CreateStatus) {
    return await Status.create(data);
  }

  async update(id: number, data: UpdateStatus) {
    const status = await Status.findByPk(id);
    if (!status) return null;

    return await status.update(data);
  }

  async delete(id: number) {
    const status = await Status.findByPk(id);
    if (!status) return null;

    await status.destroy();
    return status;
  }

  async count() {
    return await Status.count();
  }
}