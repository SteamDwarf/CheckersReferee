import styles from './TournamentBrief.module.css';
import { FC, memo } from "react"
import tournamentLogo from 'assets/images/tournament-logo.jpeg'
import { classNames } from 'shared/lib/classNames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { DatePeriod } from 'shared/UIKit/DatePeriod';
import { ITournament } from 'entities/Tournament/types/interfaces';

interface ITournamentBriefProps {
    className?: string
    tournament: ITournament
}

export const TournamentBrief: FC<ITournamentBriefProps> = memo(({
    className,
    tournament
}) => {
    return (
        <div className={classNames(className, styles.container)}>
            <div className={styles.top}>
                <img src={tournamentLogo} alt="Логотип турнира" className={styles.logo}/>
                <div className={styles.mainInfo}>
                    <p className={styles.title}>{tournament.title}</p>
                    <p className={styles.address}>
                        <FontAwesomeIcon className={styles.icon} icon={faLocationDot}/>
                        <span>{tournament.country}, {tournament.city}, {tournament.region}</span>
                    </p>
                    <p className={styles.referee}>
                        <FontAwesomeIcon className={styles.icon} icon={faUser}/>
                        <span>Главный судья: {tournament.mainReferee}</span>
                    </p>
                </div>
            </div>
            <div className={styles.bottom}>
                <DatePeriod 
                    className={styles.date} 
                    startDate={tournament.startDate} 
                    endDate={tournament.endDate}
                />
                <span className={styles.system}>{tournament.tournamentSystem} система</span>
            </div>
        </div>
    )
})