export interface TreeNode {
    name: string;
    attributes?: {
        [key: string]: string | number | boolean;
    };
    children?: TreeNode[]; // Node con
}

// Vì react-d3-tree nhận một mảng (array) cho dữ liệu multi-root
export type TreeData = TreeNode[];
