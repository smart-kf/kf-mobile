// 存储用户登录状态
import { CurrentUser } from "../models/user";

let currentUser: CurrentUser;
const setCurrentUserStates = (user: CurrentUser) => {
    currentUser = user
    localStorage.setItem('currentUser', JSON.stringify(user))
}

const getCurrentUserStates = (): CurrentUser => {
    if (currentUser == null) {
        const user = localStorage.getItem('currentUser')
        if (user) {
            currentUser = JSON.parse(user)
        }
    }
    return currentUser
}

export {
    setCurrentUserStates,
    getCurrentUserStates
}