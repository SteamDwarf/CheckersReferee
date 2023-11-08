import { ITournament } from "entities/Tournament"
import { FC, useCallback, useEffect, useState } from "react"
import styles from './TournamentStatus.module.css';

interface ITournamentStatusProps {
    tournament: ITournament
}

export const TournamentStatus:FC<ITournamentStatusProps> = ({tournament}) => {
    const [status, setStatus] = useState("notStarted")
    
    const getStatus = useCallback(() => {
        if(!tournament?.isStarted && !tournament?.isFinished) setStatus("notStarted")
        else if(tournament?.isStarted && !tournament?.isFinished) setStatus("started")
        else setStatus("finished")
    }, [tournament])

    useEffect(getStatus, [tournament, getStatus]);

    return (
        <div>
            <span className={`${styles.statusIcon} ${styles[status]}`}></span>
            {
                status === "notStarted"
                ? <span>Не стартовал</span> 
                : status === "started"
                ? <span>Cтартовал</span> 
                : <span>Завершен</span> 
            }
        </div>
    )
}
