export const MAIN = {
    AppURI: Symbol.for("AppURI"),
    AppPort: Symbol.for("AppPort"),
    DatabaseURI: Symbol.for("DatabaseURI"),
    Database: Symbol.for("Database"),
    App: Symbol.for("App")
}

export const SERVICES = {
    Auth: Symbol.for("AuthS"),
    SportsCategory: Symbol.for("SportsCategoryS"),
    Player: Symbol.for("PlayerS"),
    PlayerStats: Symbol.for("PlayerStatsS"),
    Tournament: Symbol.for("TournamentS"),
    Game: Symbol.for("GameS")
}

export const CONTROLLERS = {
    Auth: Symbol.for("AuthC"),
    SportsCategory: Symbol.for("SportsCategoryC"),
    Player: Symbol.for("PlayerC"),
    PlayerStats: Symbol.for("PlayerStatsC"),
    Tournament: Symbol.for("TournamentC"),
    Game: Symbol.for("GameC")
}

export const MIDDLEWARES = {
    Auth: Symbol.for("AuthM"),
    SportsCategory: Symbol.for("SportsCategoryM"),
    Player: Symbol.for("PlayerM"),
    PlayerStats: Symbol.for("PlayerStatsM"),
    Tournament: Symbol.for("TournamentM"),
    Error: Symbol.for("ErrorM")
}