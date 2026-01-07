"use client"

import dynamic from "next/dynamic"

const DTreeComponent = dynamic(
    () => import("./DTreeComponent"),
    { ssr: false }
)

export default function ClientPage() {
    return <DTreeComponent />
}
