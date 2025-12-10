"use client"

import dynamic from "next/dynamic"

const DynamicFamilyTree = dynamic(() => import("./FamilyTree").then((mod) => mod.SampleFamilyTree), { ssr: false })

export default function FamilyTreeClient() {
    return <DynamicFamilyTree />
}