import { Service } from "typedi";
import { getIO, getUserRoom } from "../lib/socket";

@Service()
export class SocketService {
  emitToUser(userId: number, event: string, payload: unknown) {
    const io = getIO();
    io.to(getUserRoom(userId)).emit(event, payload);
  }

  emitToUsers(userIds: number[], event: string, payload: unknown) {
    const io = getIO();
    userIds.forEach((userId) => {
      io.to(getUserRoom(userId)).emit(event, payload);
    });
  }

  emitNotification(userId: number, notification: unknown) {
    this.emitToUser(userId, "notification:new", notification);
  }

  emitTaskUpdated(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "task:updated", payload);
  }

  emitTaskCreated(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "task:created", payload);
  }

  emitTaskDeleted(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "task:deleted", payload);
  }

  emitAssigneeChanged(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "task:assignee:changed", payload);
  }

  emitCommentCreated(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "comment:created", payload);
  }

  emitCommentUpdated(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "comment:updated", payload);
  }

  emitCommentDeleted(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "comment:deleted", payload);
  }

  emitActivityCreated(userIds: number[], payload: unknown) {
    this.emitToUsers(userIds, "activity:new", payload);
  }
}
