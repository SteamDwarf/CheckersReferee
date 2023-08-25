import { injectable } from "inversify";
import BaseService from "../common/Base.service";
import {sign, verify} from "jsonwebtoken";
import { IJWTPayload } from "../common/interfaces";



@injectable()
class JWTService extends BaseService {

    public sign(login: string, secret: string, expiresIn: string):Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    login,
                    iat: Date.now()
                },
                secret,
                {
                    algorithm: "HS256",
                    expiresIn
                },
                ((error, token) => {
                    if(error) reject(error);

                    resolve(token as string);
                })
            )
        })
    }

    public verify(token: string, secret: string): Promise<IJWTPayload> {
        return new Promise<IJWTPayload>((resolve, reject) => {
            verify(
                token,
                secret,
                (error, payload) => {
                    if(error) reject(error);

                    resolve(payload as unknown as IJWTPayload);
                }
            )
        })
    }
}

export default JWTService;