export function formatDate(date: Date): string {
    const formatDate: string = `${date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate().toString()}.${date.getMonth() > 8 ? (date.getMonth() +1).toString() : '0' + (date.getMonth() +1).toString()}.${date.getFullYear().toString()}`
    return formatDate
};