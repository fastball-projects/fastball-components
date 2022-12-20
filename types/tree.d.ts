export type DataNode = {
    data: {
        title: string;
        key: string;
    }
    isLeaf?: boolean;
    children?: DataNode[];
}