export const getByPaths = (record: any, dataPath: string[]) => {
    let temp = record;
    dataPath.forEach(path => {
        if (!temp) {
            return null;
        }
        temp = temp[path];
    })
    return temp;
}

export const setByPaths = (record: any, dataPath: string | string[], value?: any) => {
    if(!Array.isArray(dataPath)) {
        record[dataPath] = value;
        return;
    }
    let temp = record;
    dataPath.forEach((path, index) => {
        if (!temp) {
            return;
        }
        if(index == dataPath.length - 1) {
            temp[path] = value;
            return;
        }
        temp = temp[path];
    })
}