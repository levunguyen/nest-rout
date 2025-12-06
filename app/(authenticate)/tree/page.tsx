import OrgTreeClient from "./tree-components/OrgTreeClient";

export default function OrganizationChartPage() {
    return (
        <main style={{ padding: '20px' }}>
            <h1>Sơ Đồ Tổ Chức (Dựa trên react-d3-tree) 📊</h1>
            <p>Sử dụng Next.js và TypeScript. Kéo chuột để di chuyển, cuộn chuột để zoom.</p>

            <div style={{ marginTop: '20px' }}>
                <OrgTreeClient />
            </div>
        </main>
    );
}