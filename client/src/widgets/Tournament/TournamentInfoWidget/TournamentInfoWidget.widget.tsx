import { ITournament } from "entities/Tournament"
import { FC } from "react"
import { InputField } from "shared/UIKit/Editables/InputField";
import styles from './TournamentInfoWidget.module.css';
import { TournamentStatus } from "features/Tournament/TournamentStatus";
import { FieldTypes } from "shared/types";
import { LabeledField } from "shared/UIKit/LabeledField";
import { TournamentSystemField } from "features/Tournament/TournamentSystemField";

interface ITournamentInfoWidgetProps {
    tournament: ITournament
    setTournament: (tournament: ITournament) => void
}

export const TournamentInfoWidget:FC<ITournamentInfoWidgetProps> = ({tournament, setTournament}) => {


    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <InputField 
                    key={tournament.title}
                    value={tournament.title}
                    onSave={(data) => setTournament({...tournament, title: data})}
                >
                    <h2>{tournament.title}</h2>
                </InputField>
                <TournamentStatus tournament={tournament}/>
            </header>
            <main className={styles.infoContainer}>
                <section className={styles.baseInfo}>
                    <div className={styles.infoColumn}>
                        <InputField 
                            key={tournament.cp}
                            value={tournament.cp}
                            onSave={(data) => setTournament({...tournament, cp: data})}
                        >
                            <LabeledField label="КП №">{tournament.cp}</LabeledField>
                        </InputField>    

                        <InputField 
                            key={tournament.country}
                            value={tournament.country}
                            onSave={(data) => setTournament({...tournament, country: data})}
                        >
                            <LabeledField label="Страна">{tournament.country}</LabeledField>
                        </InputField>

                        <InputField 
                            key={tournament.region}
                            value={tournament.region}
                            onSave={(data) => setTournament({...tournament, region: data})}
                        >
                            <LabeledField label="Регион">{tournament.region}</LabeledField>
                        </InputField>

                        <InputField 
                            key={tournament.city}
                            value={tournament.city}
                            onSave={(data) => setTournament({...tournament, city: data})}
                        >
                            <LabeledField label="Город">{tournament.city}</LabeledField>
                        </InputField>

                        <InputField 
                            type="date"
                            key={tournament.startDate}
                            value={tournament.startDate}
                            onSave={(data) => setTournament({...tournament, startDate: data})}
                        >
                            <LabeledField type={FieldTypes.date} label="Дата начала">{tournament.startDate}</LabeledField>
                        </InputField>

                        <InputField 
                            type="date"
                            key={tournament.endDate}
                            value={tournament.endDate}
                            onSave={(data) => setTournament({...tournament, endDate: data})}
                        >
                            <LabeledField type={FieldTypes.date} label="Дата окончания">{tournament.endDate}</LabeledField>
                        </InputField>
                    </div>

                    <div className={styles.infoColumn}>
                        <InputField 
                            key={tournament.mainReferee}
                            value={tournament.mainReferee}
                            onSave={(data) => setTournament({...tournament, mainReferee: data})}
                        >
                            <LabeledField label="Главный судья">{tournament.mainReferee}</LabeledField>
                        </InputField>

                        <InputField 
                            key={tournament.mainSecretary}
                            value={tournament.mainSecretary}
                            onSave={(data) => setTournament({...tournament, mainSecretary: data})}
                        >
                            <LabeledField label="Главный секретарь">{tournament.mainSecretary}</LabeledField>
                        </InputField>

                        <InputField 
                            key={tournament.timeControl}
                            value={tournament.timeControl}
                            onSave={(data) => setTournament({...tournament, timeControl: data})}
                        >
                            <LabeledField label="Контроль">{tournament.timeControl}</LabeledField>
                        </InputField>
                        
                        <TournamentSystemField 
                            key={tournament.tournamentSystem}
                            value={tournament.tournamentSystem}
                            onSave={(data) => setTournament({...tournament, tournamentSystem: data})}
                        > 
                            <LabeledField label="Система турнира">{tournament.tournamentSystem}</LabeledField>
                        </TournamentSystemField>
                    </div>
                </section>
                <section className={styles.additionalInfo}>

                </section>
            </main>
            
        </div>
    );
}