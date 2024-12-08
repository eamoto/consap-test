export default function sum(...numbers: number[]): number {
    if(!numbers.length) return 0;

    return numbers.reduce((c, v) => c + v);
}