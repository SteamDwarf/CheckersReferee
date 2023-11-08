type OptionalClassName = Record<string, boolean>;

export const classNames = (...classes: (string | OptionalClassName | undefined)[]) => {
    let classString = '';

    classes.forEach((c) => {
        if (typeof c === 'string') classString += ` ${c}`;
        if (typeof c === 'object') {
            Object.entries(c).filter(([k, v]) => v).forEach(([k, v]) => { classString += ` ${k}`; });
        }
    });

    return classString.trim();
};
