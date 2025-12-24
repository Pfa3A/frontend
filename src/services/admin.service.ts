import api from "@/api";
import type { User } from "@/types/user";
import type { CreateUserRequest} from "@/types/admin";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/api/v1/users/");
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const createOrganizer = async (
  request: CreateUserRequest
): Promise<User> => {
  try {
    const response = await api.post<User>(
      "/api/v1/users/admin/organizers",
      request
    );
    return response.data;
  } catch (err: any) {
    throw err;
  }
};