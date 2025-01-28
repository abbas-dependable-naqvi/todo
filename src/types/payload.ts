export type UserAuthData = {
  id: number;
  email: string;
  iat: number;
  exp: number;
};

export interface GetTodoRequest extends Request {
  auth: UserAuthData;
}
