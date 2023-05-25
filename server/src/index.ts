import * as dotenv from 'dotenv';

import App from './App';
import AuthController from './auth/Auth.controller';
import AuthMiddleware from './auth/Auth.middleware';
import AuthService from './auth/Auth.service';

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';

const authMiddleware = new AuthMiddleware();
const authService = new AuthService();
const authController = new AuthController(authMiddleware, authService);

const app = new App(PORT, URI, authController);

app.start();

