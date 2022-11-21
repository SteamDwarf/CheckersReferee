
enum UserRoles {
    ADMIN = "ADMIN",
    GUEST = "GUEST"
}

interface IUser {
    login: string,
    password: string,
    role?: UserRoles
}

const User = (login: string, password: string, role: UserRoles = UserRoles.GUEST): IUser => {
    return {
        login,
        password,
        role
    }
}