import logo from 'assets/images/logo.png';
import styles from './Header.module.css';
import { HeaderLink } from 'shared/UIKit/HeaderLink';
import { StaticAppLinks } from 'app/AppRouter';
import { memo } from 'react';

export const Header = memo(() => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <img className={styles.logo} src={logo} alt="logo" />
                <nav className={styles.nav}>
                    <HeaderLink to={StaticAppLinks.main}>Турниры</HeaderLink>
                    <HeaderLink to={StaticAppLinks.createTournament}>Создать турнир</HeaderLink>
                    <HeaderLink to={StaticAppLinks.players}>Игроки</HeaderLink>
                    <HeaderLink to={StaticAppLinks.createPlayer}>Создать игрока</HeaderLink>
                </nav>
            </div>
            
        </header>
    );
});

{/* <img src={checkerslogo} />

<div className={styles.divNav}>
  <NavLink to="." end>
    Все турниры
  </NavLink>

  <NavLink to="all-players">Все игроки</NavLink>
  <NavLink to="create-tournament">Создать турнир</NavLink>
  <NavLink to="registration-player">Зарегистрировать игрока</NavLink>
</div> */}