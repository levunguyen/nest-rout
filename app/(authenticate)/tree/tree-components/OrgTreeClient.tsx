"use client";

import dynamic from "next/dynamic";

const DynamicOrgTree = dynamic(
    () =>
        import("./OrgTree").then(
            (mod) => mod.SampleOrgTree
        ),
    { ssr: false }
);

export default function OrgTreeClient() {
    return <DynamicOrgTree />;
}
