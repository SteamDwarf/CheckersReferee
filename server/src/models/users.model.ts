
enum UserRoles {
    ADMIN = "ADMIN",
    GUEST = "GUEST"
}

export interface IUser {
    _id: string,
    login: string,
    password: string,
    role?: UserRoles
}

export const userSchema = {
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