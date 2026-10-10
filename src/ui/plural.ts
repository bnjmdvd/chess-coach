/** plural(3, 'review') -> "3 reviews" */
export const plural = (n: number, word: string, many = word + 's') => `${n} ${n === 1 ? word : many}`;
