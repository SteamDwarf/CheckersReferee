import { SportsDesciplines, TournamentSystems } from "./enums";

export interface ITournament {
    _id: string,
    cp: string,
    title: string,
    sportsDescipline: SportsDesciplines,
    groups: (string | undefined)[],
    startDate?: string,
    endDate?: string,
    country: string,
    city: string,
    region?: string,
    isStarted: boolean,
    isFinished: boolean,
    mainReferee: string,
    mainSecretary: string,
    referees: (string | undefined)[],
    coaches: (string | undefined)[],
    timeControl?: string,
    toursCount: number,
    currentTour: number,
    tournamentSystem: TournamentSystems,
    playersIDs: (string | undefined)[],
    gamesIDs: (string | undefined)[][],
    playersStatsIDs: (string | undefined)[],
    sportsFacility?: string
}

export interface ITournamentsQueryParams {
    limit: number,
    page: number
}