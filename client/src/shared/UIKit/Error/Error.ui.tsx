import { FC, PropsWithChildren } from "react"

interface IErrorProps extends PropsWithChildren{
    className?: string,
}

export const Error: FC<IErrorProps> = ({className, children}) => {
    return (
        <div className={className}>
            <h2>{children}</h2>
        </div>
    )
}
