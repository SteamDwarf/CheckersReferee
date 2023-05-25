
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
            additionalProperties: false,
            properties: {
                "_id": {
                    bsonType: "objectId",
                    description: "Поле _id быть ObjectId"
                },
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