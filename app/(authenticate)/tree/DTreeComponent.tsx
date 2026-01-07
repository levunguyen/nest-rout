"use client"

import { useEffect, useRef } from "react"
import dTree from "d3-dtree"
import _ from "lodash"
import { familyData } from "./dtree-data"

// ⚠️ DO NOT import modern d3
// d3 v3 will be attached globally via require

export default function DTreeComponent() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

            // 🔴 Attach LEGACY globals
            ; (window as any)._ = _
            ; (window as any).d3 = require("d3")

        containerRef.current.innerHTML = ""

        dTree.init(familyData, {
            target: containerRef.current,
            width: 900,
            height: 600,
            hideMarriageNodes: true
        })
    }, [])

    return (
        <div
            ref={containerRef}
            style={{
                width: 900,
                height: 600,
                border: "1px solid #ddd"
            }}
        />
    )
}
