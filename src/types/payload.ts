export type UserPayload = {
  id: number;
  email: string;
  iat: number;
  exp: number;
};

export interface GetTodoRequest extends Request {
  auth: UserPayload;
}
