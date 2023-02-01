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