
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

const userSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["login", "password"],
            properties: {
                "login": {
                    bsonType: "string",
                    description: "Поле login является обязательным и должно быть строкой"
                },
                "password": {
                    bsonType: "string",
                    description: "Поле password является обязательным и должно быть строкой"
                },
                "role": {
                    bsonType: "string",
                    description: "Поле role должно быть строкой"
                }
            }
        }
    }
}