import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TreeData, TreeNode } from '../types/TreeData';

// ⚠️ Dynamic import: Bắt buộc để tránh lỗi SSR
const Tree = dynamic(() => import('react-d3-tree'), { ssr: false });

// Dữ liệu ví dụ (dựa trên cấu trúc của react-d3-tree)
const orgChart: TreeData = [
    {
        name: 'CEO (Giám đốc điều hành)',
        attributes: {
            department: 'Executive',
            level: 1,
        },
        children: [
            {
                name: 'VP Sales (Phó chủ tịch kinh doanh)',
                attributes: {
                    department: 'Sales',
                    level: 2,
                },
                children: [
                    {
                        name: 'Sales Manager (Quản lý bán hàng)',
                        attributes: {
                            level: 3,
                        },
                    },
                ],
            },
            {
                name: 'VP Engineering (Phó chủ tịch kỹ thuật)',
                attributes: {
                    department: 'Engineering',
                    level: 2,
                },
                children: [
                    {
                        name: 'Lead Developer (Trưởng nhóm phát triển)',
                        attributes: {
                            level: 3,
                        },
                        children: [
                            {
                                name: 'Developer I',
                                attributes: {
                                    level: 4,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '600px', // Đảm bảo container có chiều cao cố định
    backgroundColor: '#f9f9f9',
};

interface OrgTreeProps {
    data: TreeData;
}

export const OrgTree: React.FC<OrgTreeProps> = ({ data }) => {
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Thiết lập vị trí ban đầu (căn giữa) sau khi component mount
        const container = document.getElementById('tree-container');
        if (container) {
            setTranslate({
                x: container.offsetWidth / 5, // Dịch sang phải một chút
                y: container.offsetHeight / 2, // Căn giữa theo chiều dọc
            });
        }
    }, []);

    return (
        <div id="tree-container" style={containerStyles}>
            <Tree
                data={data}
                translate={translate}
                orientation="vertical" // Sơ đồ tổ chức thường hiển thị dọc
                separation={{ siblings: 0.8, nonSiblings: 1.2 }}
                nodeSize={{ x: 250, y: 100 }} // Điều chỉnh kích thước node
                zoomable={true} // Bật tính năng zoom bằng con lăn chuột
                draggable={true} // Bật tính năng kéo (pan)
                pathFunc="step" // Kiểu đường nối (có thể dùng 'straight', 'diagonal', 'step')
                onNodeClick={(nodeData) => {
                    alert(`Thông tin Node: ${nodeData.data.name}\nLevel: ${nodeData.data.attributes?.level}`);
                }}
            // Tùy chỉnh node nếu muốn dùng HTML/SVG phức tạp hơn
            // renderCustomNodeElement={(rd3tProps) => <YourCustomNode {...rd3tProps} />}
            />
        </div>
    );
};

// Component tiện ích để sử dụng nhanh với dữ liệu mẫu
export const SampleOrgTree: React.FC = () => {
    return <OrgTree data={orgChart} />;
};
