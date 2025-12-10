"use client"

import type React from "react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { TreeData } from "../types/TreeData"
import { FamilyTreeNode } from "../tree-components/FamilyTreeNode"

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false })

const familyTreeData: TreeData = [
    {
        name: "Robert Johnson",
        attributes: {
            image: "/images/attachments-gen-images-public-elderly-man-portrait.png",
            birthYear: 1951,
            status: "alive",
            gender: "male",
            age: 72,
        },
        children: [
            {
                name: "James Anderson",
                attributes: {
                    image: "/images/attachments-gen-images-public-middle-aged-man-professional.jpg",
                    birthYear: 1978,
                    status: "alive",
                    gender: "male",
                    age: 45,
                },
                children: [
                    {
                        name: "Sarah Anderson",
                        attributes: {
                            image: "/images/attachments-gen-images-public-young-girl-student-indoor.jpg",
                            birthYear: 2008,
                            status: "alive",
                            gender: "female",
                            age: 16,
                        },
                    },
                    {
                        name: "Michael Anderson",
                        attributes: {
                            image: "/images/attachments-gen-images-public-professional-man-portrait.png",
                            birthYear: 2012,
                            status: "alive",
                            gender: "male",
                            age: 12,
                        },
                    },
                ],
            },
            {
                name: "Margaret Johnson",
                attributes: {
                    image: "/images/attachments-gen-images-public-elderly-woman-portrait.png",
                    birthYear: 1953,
                    status: "alive",
                    gender: "female",
                    age: 70,
                },
            },
            {
                name: "Elizabeth Parker",
                attributes: {
                    image: "/images/attachments-gen-images-public-elderly-man-glasses.png",
                    birthYear: 1981,
                    status: "alive",
                    gender: "female",
                    age: 43,
                },
            },
        ],
    },
]

interface FamilyTreeProps {
    data?: TreeData
}

const containerStyles: React.CSSProperties = {
    width: "100%",
    height: "700px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({ data = familyTreeData }) => {
    const [translate, setTranslate] = useState({ x: 0, y: 100 })

    useEffect(() => {
        const container = document.getElementById("family-tree-container")
        if (container) {
            setTranslate({
                x: container.offsetWidth / 2,
                y: 100,
            })
        }
    }, [])

    return (
        <div id="family-tree-container" style={containerStyles}>
            <Tree
                data={data}
                translate={translate}
                orientation="vertical"
                separation={{ siblings: 2.5, nonSiblings: 3 }}
                nodeSize={{ x: 200, y: 220 }}
                zoomable={true}
                draggable={true}
                pathFunc="step"
                renderCustomNodeElement={(rd3tProps) => <FamilyTreeNode nodeDatum={rd3tProps.nodeDatum} />}
            />
        </div>
    )
}

export const SampleFamilyTree: React.FC = () => {
    return <FamilyTree data={familyTreeData} />
}
