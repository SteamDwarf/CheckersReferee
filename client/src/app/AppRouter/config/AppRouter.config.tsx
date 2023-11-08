import { Tournaments } from 'pages/Tournaments';
import { TournamentDetails } from 'pages/TournamentDetails';
import { createBrowserRouter } from 'react-router-dom';
import { AppEndpoints } from './AppEndpoints';
import { MainLayout } from 'pages/MainLayout';
import { TournamentInfoPage } from 'pages/TournamentInfo';


export const AppRouter = createBrowserRouter([
    {
        path: AppEndpoints.main,
        element: <MainLayout />,
        errorElement: <div>Not Found</div>,
        children: [
            {
                index: true,
                element: <Tournaments />
            },
            {
                path: AppEndpoints.createTournament,
                element: <div>Create tournament</div>
            },
            {
                path: AppEndpoints.players,
                element: <div>Players</div>
            },
            {
                path: AppEndpoints.createPlayer,
                element: <div>Create Player</div>
            },
            {
                path: AppEndpoints.tournament,
                //TODO обернуть в контекст турнира
                element: <TournamentDetails />,
                children: [
                    {
                        index: true,
                        element: <TournamentInfoPage />
                    },
                    {
                        path: AppEndpoints.tournamentPlayers,
                        element: <div>Tournament Players</div>
                    },
                    {
                        path: AppEndpoints.tournamentTours,
                        element: <div>Tournament Tours</div>
                    },
                    {
                        path: AppEndpoints.tournamentTable,
                        element: <div>Tournament Table</div>
                    }
                ]
            }
        ]
    }
]);
