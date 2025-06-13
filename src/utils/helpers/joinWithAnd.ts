const joinWithAnd = (strings: string[]): string => {
    if (strings.length === 0) return '';
    if (strings.length === 1) return strings[0];
    if (strings.length === 2) return strings.join(' and ');

    const lastItem = strings.pop();
    return `${strings.join(', ')} and ${lastItem}`;
};

export default joinWithAnd
