import type React from "react"

interface CustomNodeProps {
    nodeDatum: {
        name: string
        attributes?: {
            image?: string
            birthYear?: number
            deathYear?: number
            status?: string
            gender?: string
            age?: number
        }
    }
    toggleNode?: () => void
}

export const FamilyTreeNode: React.FC<CustomNodeProps> = ({ nodeDatum }) => {
    const { name, attributes = {} } = nodeDatum

    const { image, birthYear, deathYear, status = "alive", gender = "male", age } = attributes

    const borderColor = gender === "male" ? "#06b6d4" : "#ec4899"
    const dotColor = gender === "male" ? "#06b6d4" : "#ec4899"

    return (
        <g>
            {/* Card background */}
            <rect x="-90" y="-80" width="180" height="160" rx="8" fill="white" stroke={borderColor} strokeWidth="2" />

            {/* Image area */}
            {image && (
                <image
                    x="-80"
                    y="-70"
                    width="160"
                    height="70"
                    href={image}
                    preserveAspectRatio="xMidYMid slice"
                    style={{ opacity: status === "deceased" ? 0.5 : 1 }}
                />
            )}

            {/* Gender indicator dot */}
            <circle cx="-70" cy="-62" r="6" fill={dotColor} stroke="white" strokeWidth="2" />

            {/* Name text */}
            <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1f2937">
                {name}
            </text>

            {/* Birth/Death years */}
            <text x="0" y="20" textAnchor="middle" fontSize="10" fill="#6b7280">
                {birthYear}
                {deathYear ? ` – ${deathYear}` : ""}
            </text>

            {/* Age or status */}
            {age && (
                <text x="0" y="35" textAnchor="middle" fontSize="9" fill="#9ca3af">
                    {age} years
                </text>
            )}

            {status === "deceased" && (
                <text x="0" y="35" textAnchor="middle" fontSize="9" fill="#9ca3af" fontStyle="italic">
                    Deceased
                </text>
            )}
        </g>
    )
}
