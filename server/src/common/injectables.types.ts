export const MAIN = {
    AppURI: Symbol.for("AppURI"),
    AppPort: Symbol.for("AppPort"),
    DatabaseURI: Symbol.for("DatabaseURI"),
    Database: Symbol.for("Database"),
    App: Symbol.for("App"),
    Utils: Symbol.for("Utils")
}

export const REPOSITORIES = {
    Player: Symbol.for("PlayerRepository"),
    RankList: Symbol.for("RankListRepository")
}

export const SERVICES = {
    Auth: Symbol.for("AuthService"),
    SportsCategory: Symbol.for("SportsCategoryService"),
    Player: Symbol.for("PlayerService"),
    PlayerStats: Symbol.for("PlayerStatsService"),
    Tournament: Symbol.for("TournamentService"),
    Game: Symbol.for("GameService"),
    RankList: Symbol.for("RankListService")
}

export const CONTROLLERS = {
    Auth: Symbol.for("AuthController"),
    SportsCategory: Symbol.for("SportsCategoryController"),
    Player: Symbol.for("PlayerController"),
    PlayerStats: Symbol.for("PlayerStatsController"),
    Tournament: Symbol.for("TournamentController"),
    Game: Symbol.for("GameController"),
    RankList: Symbol.for("RankListController")
}

export const MIDDLEWARES = {
    Auth: Symbol.for("AuthMiddleware"),
    SportsCategory: Symbol.for("SportsCategoryMiddleware"),
    Player: Symbol.for("PlayerMiddleware"),
    PlayerStats: Symbol.for("PlayerStatsMiddleware"),
    Tournament: Symbol.for("TournamentMiddleware"),
    RankList: Symbol.for("RankListMiddleware"),
    Error: Symbol.for("ErrorMiddleware")
}