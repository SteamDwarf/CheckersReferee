import { FC, memo } from 'react';
import { TournamentBrief, tournamentParamsSelect, useGetTournamentsQuery } from 'entities/Tournament';
import styles from './TournamentBrief.module.css';
import { Link } from 'react-router-dom';
import { DynamicAppLinks } from 'app/AppRouter';
import { useSelector } from 'react-redux';

interface ITournamentBriefWidgetProps {
    tournamentId: string
}

export const TournamentBriefWidget: FC<ITournamentBriefWidgetProps> = memo(({tournamentId}) => {
    const tournamentParams = useSelector(tournamentParamsSelect);

    const {tournament} = useGetTournamentsQuery(tournamentParams, {
        selectFromResult: ({data}) => ({
            tournament : data?.find(t => t._id === tournamentId)
        })
    })

    if(tournament) return (
        <div className={styles.container}>
            <Link to={DynamicAppLinks.tournament(tournament._id)}>
                <TournamentBrief 
                    tournament={tournament}
                /> 
            </Link>
            
        </div>
    );
})