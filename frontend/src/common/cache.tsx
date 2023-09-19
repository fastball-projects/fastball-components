let currentPage = '';
let cache: Record<string, any> = {}
let ttlMap: Record<string, number> = {}

export const setCache = (key: string, value: any) => {
    cache[key] = value;
    ttlMap[key] = new Date().getTime() + 5 * 60 * 1000;
}

export const loadCache = (key: string): any => {
    if (location.hash != currentPage) {
        currentPage = location.hash;
        cache = {};
        ttlMap = {};
        return null;
    }
    if (ttlMap[key]) {
        if (ttlMap[key] > new Date().getTime()) {
            return cache[key]
        } else {
            ttlMap[key] = 0;
            cache[key] = null;
        }
    }
    return null;
}