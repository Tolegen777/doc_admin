export function objectToQueryParams(obj: Record<string, any>): string {
    return Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}
// {age: 5, name: '', height: undefined} => 'age=5'

