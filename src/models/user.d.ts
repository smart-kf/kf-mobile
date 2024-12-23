/**
 * 定义用户类别
 */
export type CurrentUser = {
  id: number;
  username: string;
  account: string;
  avatar: string;
  profile: string;
  gender: number;
  phone: string;
  email: string;
  status: number;
  role: number;
  tags: string[];
  createTime: string;
}