// 存储用户登录状态
import {CurrentUser} from "../models/user";

let currentUser: CurrentUser;
const setCurrentUserStates = (user: CurrentUser) => {
    currentUser = user
}

const getCurrentUserStates = (): CurrentUser => {
    return currentUser
}

export {
    setCurrentUserStates,
    getCurrentUserStates
}