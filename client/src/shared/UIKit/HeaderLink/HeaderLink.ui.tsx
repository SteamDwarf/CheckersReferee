import { NavLink } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import { classNames } from 'shared/lib/classNames';
import styles from './HeaderLink.module.css';

interface IHeaderLinkProps extends PropsWithChildren{
    to: string
    className?: string
    end?: boolean
}

export const HeaderLink:FC<IHeaderLinkProps> = ({to, children, className, end}) => {
    return (
        <NavLink 
            end={end}
            className={({isActive}) => classNames(className, styles.link, {[styles.active]: isActive})} 
            to={to}
        >
            {children}
        </NavLink>
    );
}