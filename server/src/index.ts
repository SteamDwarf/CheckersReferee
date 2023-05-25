import * as dotenv from 'dotenv';

import App from './App';
import AuthController from './auth/Auth.controller';
import AuthMiddleware from './auth/Auth.middleware';
import AuthService from './auth/Auth.service';
import SportsCategoryService from './sportsCategory/SportsCategory.service';
import SportsCategoryController from './sportsCategory/SportsCategory.controller';
import PlayerService from './players/Player.service';
import PlayerController from './players/Player.controller';
import ErrorHandler from './errors/ErrorHandler.middleware';

dotenv.config({path: `${__dirname}/../.env`});

const PORT = process.env.PORT || '5000';
const URI = process.env.URI || 'http://localhost';

const authMiddleware = new AuthMiddleware();
const authService = new AuthService();
const authController = new AuthController(authMiddleware, authService);

const sportsCategoryService = new SportsCategoryService();
const sportsCategoryController = new SportsCategoryController(sportsCategoryService);

const playerService = new PlayerService(sportsCategoryService);
const playerController = new PlayerController(playerService);

const errorHandler = new ErrorHandler();

const app = new App(
    PORT, 
    URI, 
    authController, 
    sportsCategoryController,
    playerController,
    errorHandler
);

app.start();

