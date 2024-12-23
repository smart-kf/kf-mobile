import {CurrentUser} from "./user";

/**
 * 定义用户类别
 */
export type TeamType = {
    id: number,
    name: string,
    description: string,
    expireTime?: Date,
    maxNum: number,
    password?: string,
    // 状态封装枚举值
    status: number,
    createTime: Date,
    updateTime: Date,
    createUser?: CurrentUser
}