export const MAIN = {
    AppURI: Symbol.for("AppURI"),
    AppPort: Symbol.for("AppPort"),
    DatabaseURI: Symbol.for("DatabaseURI"),
    DocumentsPath: Symbol.for("DocumentsPath"),
    AccessSecret: Symbol.for("AccessSecret"),
    RefreshSecret: Symbol.for("RefreshSecret"),
    CookieSecret: Symbol.for("CookieSecret"),
    AccessTokenLife: Symbol.for("AccessTokenLife"),
    RefreshTokenLife: Symbol.for("RefreshTokenLife"),

    Database: Symbol.for("Database"),
    DocumentsDatabase: Symbol.for("DocumentsDatabase"),
    App: Symbol.for("App"),
    Utils: Symbol.for("Utils"),
    Calculations: Symbol.for("Calculations")
}

export const REPOSITORIES = {
    Auth: Symbol.for("AuthRepository"),
    SportsCategory: Symbol.for("SportsCategoryRepository"),
    Player: Symbol.for("PlayerRepository"),
    Game: Symbol.for("GameRepository"),
    PlayerStats: Symbol.for("PlayerStatsRepository"),
    Tournament: Symbol.for("TournamentRepository"),
    RankList: Symbol.for("RankListRepository"),
    Document: Symbol.for("DocumentsRepository"),
}

export const SERVICES = {
    Auth: Symbol.for("AuthService"),
    JWT: Symbol.for("JWT"),
    SportsCategory: Symbol.for("SportsCategoryService"),
    Player: Symbol.for("PlayerService"),
    PlayerStats: Symbol.for("PlayerStatsService"),
    Tournament: Symbol.for("TournamentService"),
    Game: Symbol.for("GameService"),
    RankList: Symbol.for("RankListService"),
    Document: Symbol.for("DocumentsService")
}

export const CONTROLLERS = {
    Auth: Symbol.for("AuthController"),
    SportsCategory: Symbol.for("SportsCategoryController"),
    Player: Symbol.for("PlayerController"),
    PlayerStats: Symbol.for("PlayerStatsController"),
    Tournament: Symbol.for("TournamentController"),
    Game: Symbol.for("GameController"),
    RankList: Symbol.for("RankListController"),
    Document: Symbol.for("DocumentsController")
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