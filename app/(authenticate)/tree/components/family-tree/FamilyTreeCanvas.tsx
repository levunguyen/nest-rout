"use client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { FamilyMember } from "../../types/FamilyTree";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { cn } from "../../lib/utils";
import { Heart, Plus, Minus } from "lucide-react";

interface FamilyTreeCanvasProps {
  members: FamilyMember[];
  zoom: number;
  selectedGeneration: number | null;
  searchQuery: string;
  onMemberClick: (member: FamilyMember) => void;
  onMemberEdit: (member: FamilyMember) => void;
  selectedMemberId?: string;
  collapsedNodes: Set<string>;
  onToggleCollapse: (memberId: string) => void;
  hoveredMemberId?: string;
  onMemberHover?: (memberId: string | null) => void;
  onZoomChange?: (zoom: number) => void;
}

const CARD_WIDTH = 100;
const CARD_HEIGHT = 90;
const HORIZONTAL_GAP = 20;
const COUPLE_GAP = 30;
const VERTICAL_GAP = 120;
const FAMILY_GAP = 60;

export const FamilyTreeCanvas = ({
  members,
  zoom,
  selectedGeneration,
  searchQuery,
  onMemberClick,
  onMemberEdit,
  selectedMemberId,
  collapsedNodes,
  onToggleCollapse,
  hoveredMemberId,
  onMemberHover,
  onZoomChange,
}: FamilyTreeCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const prevSelectedGeneration = useRef<number | null>(null);
  const prevSearchQuery = useRef<string>("");

  // Find all spouses (supports multiple spouses)
  const findSpouses = useCallback((member: FamilyMember): FamilyMember[] => {
    const spouses: FamilyMember[] = [];

    // Check if member has spouseIds
    if (member.spouseIds && member.spouseIds.length > 0) {
      member.spouseIds.forEach(spouseId => {
        const spouse = members.find(m => m.id === spouseId);
        if (spouse) spouses.push(spouse);
      });
    }

    // Also check if this member is listed as someone else's spouse
    members.forEach(m => {
      if (m.spouseIds?.includes(member.id) && !spouses.find(s => s.id === m.id)) {
        spouses.push(m);
      }
    });

    return spouses;
  }, [members]);

  // Find first spouse (for backward compatibility)
  const findSpouse = useCallback((member: FamilyMember): FamilyMember | null => {
    const spouses = findSpouses(member);
    return spouses.length > 0 ? spouses[0] : null;
  }, [findSpouses]);

  // Get children of a parent (by parentId)
  const getChildren = useCallback((parentId: string): FamilyMember[] => {
    return members.filter(m => m.parentId === parentId);
  }, [members]);

  // Get all descendants of collapsed nodes
  const getDescendantsOfCollapsed = useCallback((): Set<string> => {
    const hiddenIds = new Set<string>();

    const addDescendants = (parentId: string) => {
      members.forEach(m => {
        if (m.parentId === parentId && !hiddenIds.has(m.id)) {
          hiddenIds.add(m.id);
          // Also add spouses
          const spouses = findSpouses(m);
          spouses.forEach(spouse => hiddenIds.add(spouse.id));
          // Recursively add children
          addDescendants(m.id);
        }
      });
    };

    collapsedNodes.forEach(nodeId => {
      addDescendants(nodeId);
    });

    return hiddenIds;
  }, [members, collapsedNodes, findSpouses]);

  // Filter visible members
  const visibleMembers = useMemo(() => {
    let filtered = members;

    // Filter by generation if selected - show selected generation + 3 generations after
    if (selectedGeneration !== null) {
      filtered = filtered.filter(m =>
        m.generation >= selectedGeneration && m.generation <= selectedGeneration + 3
      );
    }

    // Hide descendants of collapsed nodes
    const hiddenIds = getDescendantsOfCollapsed();
    if (hiddenIds.size > 0) {
      filtered = filtered.filter(m => !hiddenIds.has(m.id));
    }

    return filtered;
  }, [members, selectedGeneration, getDescendantsOfCollapsed]);

  // Get generations
  const generations = useMemo(() => {
    return Array.from(new Set(visibleMembers.map(m => m.generation))).sort((a, b) => a - b);
  }, [visibleMembers]);

  // Get minimum generation for Y offset calculation
  const minGeneration = useMemo(() => {
    return Math.min(...members.map(m => m.generation));
  }, [members]);

  // Calculate tree layout - recursive bottom-up approach with multiple spouse support
  const { positions, connections } = useMemo(() => {
    const posMap = new Map<string, { x: number; y: number }>();
    const conns: Array<{
      parentId: string;
      coupleX: number;
      coupleY: number;
      childPositions: Array<{ x: number; y: number }>;
      isHighlighted: boolean;
    }> = [];

    // Track which members have been processed
    const processed = new Set<string>();

    // Calculate subtree width for a family unit (including multiple spouses)
    // When husband has multiple wives: wife1 - husband - wife2 layout
    const getSubtreeWidth = (memberId: string): number => {
      const member = members.find(m => m.id === memberId);
      if (!member) return CARD_WIDTH;

      const children = getChildren(memberId);
      const spouses = findSpouses(member);

      if (children.length === 0) {
        // Width = member + all spouses (husband in middle layout)
        const numSpouses = spouses.length;
        if (numSpouses === 0) return CARD_WIDTH;
        // All spouses + husband + gaps
        return (numSpouses + 1) * CARD_WIDTH + numSpouses * COUPLE_GAP;
      }

      let totalWidth = 0;
      const processedChildren = new Set<string>();

      children.forEach(child => {
        if (processedChildren.has(child.id)) return;
        processedChildren.add(child.id);

        const childSpouses = findSpouses(child);
        childSpouses.forEach(sp => processedChildren.add(sp.id));

        totalWidth += getSubtreeWidth(child.id) + FAMILY_GAP;
      });

      const numSpouses = spouses.length;
      const spouseWidth = (numSpouses + 1) * CARD_WIDTH + numSpouses * COUPLE_GAP;
      return Math.max(totalWidth - FAMILY_GAP, spouseWidth);
    };

    // Position a family unit and its descendants (supports multiple spouses)
    const positionFamily = (memberId: string, startX: number, genY: number): number => {
      const member = members.find(m => m.id === memberId);
      if (!member || processed.has(memberId)) return startX;

      const spouses = findSpouses(member);
      const children = getChildren(memberId);

      // Mark as processed
      processed.add(memberId);
      spouses.forEach(spouse => processed.add(spouse.id));

      // Helper to position member in center with spouses on sides
      const positionMemberWithSpouses = (memberX: number) => {
        if (spouses.length === 0) {
          posMap.set(memberId, { x: memberX, y: genY });
          return memberX + CARD_WIDTH;
        } else if (spouses.length === 1) {
          // Single spouse: member on left, spouse on right
          posMap.set(memberId, { x: memberX, y: genY });
          posMap.set(spouses[0].id, { x: memberX + CARD_WIDTH + COUPLE_GAP, y: genY });
          return memberX + CARD_WIDTH * 2 + COUPLE_GAP;
        } else {
          // Multiple spouses: member in center, spouses on sides
          // Layout: spouse1 - member - spouse2 - spouse3...
          const leftSpouse = spouses[0];
          const rightSpouses = spouses.slice(1);

          // Position left spouse
          posMap.set(leftSpouse.id, { x: memberX, y: genY });
          // Position member in center
          posMap.set(memberId, { x: memberX + CARD_WIDTH + COUPLE_GAP, y: genY });
          // Position right spouses
          let rightX = memberX + (CARD_WIDTH + COUPLE_GAP) * 2;
          rightSpouses.forEach(spouse => {
            posMap.set(spouse.id, { x: rightX, y: genY });
            rightX += CARD_WIDTH + COUPLE_GAP;
          });
          return rightX - COUPLE_GAP;
        }
      };

      if (children.length === 0) {
        // Leaf node - position member and all spouses
        return positionMemberWithSpouses(startX);
      }

      // Position children first (bottom-up)
      const childGenY = genY + CARD_HEIGHT + VERTICAL_GAP;
      let childX = startX;
      const childCenters: number[] = [];
      const processedChildren = new Set<string>();

      children.forEach(child => {
        if (processedChildren.has(child.id)) return;
        processedChildren.add(child.id);

        const childSpouses = findSpouses(child);
        childSpouses.forEach(sp => processedChildren.add(sp.id));

        const beforeX = childX;
        childX = positionFamily(child.id, childX, childGenY);

        // Calculate center of this child's family unit
        const childPos = posMap.get(child.id);
        if (childPos) {
          if (childSpouses.length > 0) {
            // Get all positions to find center
            let leftMostX = childPos.x;
            let rightMostX = childPos.x + CARD_WIDTH;
            childSpouses.forEach(sp => {
              const spPos = posMap.get(sp.id);
              if (spPos) {
                leftMostX = Math.min(leftMostX, spPos.x);
                rightMostX = Math.max(rightMostX, spPos.x + CARD_WIDTH);
              }
            });
            childCenters.push((leftMostX + rightMostX) / 2);
          } else {
            childCenters.push(childPos.x + CARD_WIDTH / 2);
          }
        }

        childX += FAMILY_GAP;
      });

      // Position parents centered above children
      const leftMostChild = Math.min(...childCenters);
      const rightMostChild = Math.max(...childCenters);
      const centerX = (leftMostChild + rightMostChild) / 2;

      // Calculate total width of parent group
      const numSpouses = spouses.length;
      const parentGroupWidth = (numSpouses + 1) * CARD_WIDTH + numSpouses * COUPLE_GAP;
      const parentStartX = centerX - parentGroupWidth / 2;

      positionMemberWithSpouses(parentStartX);

      return childX - FAMILY_GAP;
    };

    // Start with root members (no parentId - could be any generation)
    const rootMembers = visibleMembers.filter(m => !m.parentId);
    let currentX = 0;

    rootMembers.forEach(member => {
      if (processed.has(member.id)) return;

      const genY = (member.generation - minGeneration) * (CARD_HEIGHT + VERTICAL_GAP);
      const endX = positionFamily(member.id, currentX, genY);
      currentX = endX + FAMILY_GAP * 2;
    });

    // Position any orphan members (parents not found or not positioned)
    // Group by generation
    const orphansByGen = new Map<number, FamilyMember[]>();
    visibleMembers.forEach(member => {
      if (posMap.has(member.id)) return; // Already positioned
      if (!orphansByGen.has(member.generation)) {
        orphansByGen.set(member.generation, []);
      }
      orphansByGen.get(member.generation)!.push(member);
    });

    // Position orphans by generation
    orphansByGen.forEach((orphans, gen) => {
      const genY = (gen - minGeneration) * (CARD_HEIGHT + VERTICAL_GAP);
      const processedOrphans = new Set<string>();

      orphans.forEach(member => {
        if (processedOrphans.has(member.id)) return;
        processedOrphans.add(member.id);

        posMap.set(member.id, { x: currentX, y: genY });

        const spouses = findSpouses(member);
        const spousesInVisible = spouses.filter(sp => visibleMembers.find(m => m.id === sp.id));

        if (spousesInVisible.length > 0) {
          let spouseX = currentX + CARD_WIDTH + COUPLE_GAP;
          spousesInVisible.forEach(spouse => {
            if (!posMap.has(spouse.id)) {
              processedOrphans.add(spouse.id);
              posMap.set(spouse.id, { x: spouseX, y: genY });
              spouseX += CARD_WIDTH + COUPLE_GAP;
            }
          });
          currentX = spouseX + HORIZONTAL_GAP;
        } else {
          currentX += CARD_WIDTH + HORIZONTAL_GAP;
        }
      });
      currentX += FAMILY_GAP;
    });

    // Build connections for each parent with children
    const processedParents = new Set<string>();
    visibleMembers.forEach(member => {
      // Skip if already processed (as spouse)
      if (processedParents.has(member.id)) return;

      const children = getChildren(member.id);
      const spouses = findSpouses(member);

      // Also get spouses' children
      let allChildren = [...children];
      spouses.forEach(spouse => {
        const spouseChildren = getChildren(spouse.id);
        spouseChildren.forEach(sc => {
          if (!allChildren.find(c => c.id === sc.id)) {
            allChildren.push(sc);
          }
        });
        processedParents.add(spouse.id);
      });
      processedParents.add(member.id);

      if (allChildren.length === 0) return;

      const memberPos = posMap.get(member.id);
      if (!memberPos) return;

      // Calculate couple center (member + all spouses)
      let coupleX: number;
      if (spouses.length > 0) {
        let leftX = memberPos.x;
        let rightX = memberPos.x + CARD_WIDTH;
        spouses.forEach(spouse => {
          const spousePos = posMap.get(spouse.id);
          if (spousePos) {
            rightX = Math.max(rightX, spousePos.x + CARD_WIDTH);
          }
        });
        coupleX = (leftX + rightX) / 2;
      } else {
        coupleX = memberPos.x + CARD_WIDTH / 2;
      }

      const coupleY = memberPos.y + 32; // anchor at spouse line / avatar center

      // Get child positions (only blood children, not spouses)
      // Anchor at child avatar center so the line touches the node (like the reference image)
      const childPositions = allChildren
        .filter(child => {
          const childSpouses = findSpouses(child);
          return childSpouses.length === 0 || !allChildren.find(c => childSpouses.some(sp => sp.id === c.id));
        })
        .map(child => {
          const pos = posMap.get(child.id);
          if (!pos) return null;
          return { x: pos.x + CARD_WIDTH / 2, y: pos.y + 32 };
        })
        .filter(Boolean) as Array<{ x: number; y: number }>;

      if (childPositions.length > 0) {
        const isHighlighted = hoveredMemberId === member.id || spouses.some(sp => hoveredMemberId === sp.id);
        conns.push({
          parentId: member.id,
          coupleX,
          coupleY,
          childPositions,
          isHighlighted: !!isHighlighted,
        });
      }
    });

    // Center the entire tree
    let minX = Infinity, maxX = -Infinity;
    posMap.forEach(pos => {
      if (pos.x < minX) minX = pos.x;
      if (pos.x + CARD_WIDTH > maxX) maxX = pos.x + CARD_WIDTH;
    });

    const offsetX = -(minX + maxX) / 2;
    posMap.forEach((pos, id) => {
      posMap.set(id, { x: pos.x + offsetX, y: pos.y });
    });

    conns.forEach(conn => {
      conn.coupleX += offsetX;
      conn.childPositions.forEach(cp => { cp.x += offsetX; });
    });

    return { positions: posMap, connections: conns };
  }, [visibleMembers, members, findSpouses, findSpouse, getChildren, hoveredMemberId, minGeneration]);

  // Render connections - offset by svgWidth/2 to convert from centered coords to SVG coords
  const svgWidth = useMemo(() => {
    let maxAbsX = 0;
    positions.forEach(({ x }) => {
      maxAbsX = Math.max(maxAbsX, Math.abs(x));
    });

    // Ensure SVG is always wide enough for the widest generation (prevents clipped spouse lines)
    const padding = 800;
    return Math.max(5000, (maxAbsX + CARD_WIDTH) * 2 + padding);
  }, [positions]);
  const svgOffset = svgWidth / 2;

  const renderConnections = useCallback(() => {
    const lines: JSX.Element[] = [];

    // Draw spouse connections (horizontal lines between couples - supports multiple spouses)
    const drawnSpouses = new Set<string>();
    visibleMembers.forEach(member => {
      const spouses = findSpouses(member);
      if (spouses.length === 0) return;

      const memberPos = positions.get(member.id);
      if (!memberPos) return;

      // Draw line from member to each spouse
      spouses.forEach((spouse, spouseIndex) => {
        if (!visibleMembers.find(m => m.id === spouse.id)) return;

        const key = [member.id, spouse.id].sort().join('-');
        if (drawnSpouses.has(key)) return;
        drawnSpouses.add(key);

        const spousePos = positions.get(spouse.id);
        if (!spousePos) return;

        const leftX = Math.min(memberPos.x, spousePos.x) + CARD_WIDTH + svgOffset;
        const rightX = Math.max(memberPos.x, spousePos.x) + svgOffset;
        const y = memberPos.y + 32; // Center of avatar

        const midX = (leftX + rightX) / 2;

        // Left line segment
        lines.push(
          <line
            key={`spouse-left-${key}`}
            x1={leftX}
            y1={y}
            x2={midX - 10}
            y2={y}
            stroke="#9ca3af"
            strokeWidth="2"
          />
        );

        // Right line segment
        lines.push(
          <line
            key={`spouse-right-${key}`}
            x1={midX + 10}
            y1={y}
            x2={rightX}
            y2={y}
            stroke="#9ca3af"
            strokeWidth="2"
          />
        );

        // Heart icon in the middle
        lines.push(
          <foreignObject
            key={`heart-${key}`}
            x={midX - 8}
            y={y - 8}
            width={16}
            height={16}
          >
            <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
          </foreignObject>
        );
      });
    });

    // Draw parent-child connections
    connections.forEach((conn, idx) => {
      const { parentId, coupleX, coupleY, childPositions, isHighlighted } = conn;
      const color = isHighlighted ? "#f97316" : "#9ca3af";
      const width = isHighlighted ? 2.5 : 2;
      const isCollapsed = collapsedNodes.has(parentId);

      // Offset all X coordinates
      const cx = coupleX + svgOffset;
      const childY = childPositions[0].y;
      const midY = coupleY + (childY - coupleY) / 2;

      // Vertical from parent to mid (shorter if collapsed)
      const verticalEndY = isCollapsed ? coupleY + 30 : midY;
      lines.push(
        <line key={`v-down-${idx}`} x1={cx} y1={coupleY} x2={cx} y2={verticalEndY}
          stroke={color} strokeWidth={width}
        />
      );

      // Collapse/Expand button at the intersection
      lines.push(
        <foreignObject
          key={`collapse-btn-${idx}`}
          x={cx - 10}
          y={verticalEndY - 10}
          width={20}
          height={20}
          style={{ overflow: 'visible', pointerEvents: 'auto' }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(parentId);
              }}
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                "bg-primary text-primary-foreground shadow-md cursor-pointer",
                "hover:scale-110 transition-transform",
                "border-2 border-background"
              )}
              style={{ pointerEvents: 'auto' }}
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              {isCollapsed ? (
                <Plus className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
            </button>
          </div>
        </foreignObject>
      );

      // Only draw the rest if not collapsed
      if (!isCollapsed) {
        // Horizontal line at mid level
        const offsetChildPositions = childPositions.map(cp => ({ x: cp.x + svgOffset, y: cp.y }));

        if (offsetChildPositions.length > 1) {
          const leftX = Math.min(...offsetChildPositions.map(c => c.x));
          const rightX = Math.max(...offsetChildPositions.map(c => c.x));

          lines.push(
            <line key={`h-${idx}`} x1={leftX} y1={midY} x2={rightX} y2={midY}
              stroke={color} strokeWidth={width}
            />
          );

          // Connect parent drop to horizontal if needed
          if (cx < leftX) {
            lines.push(<line key={`h-l-${idx}`} x1={cx} y1={midY} x2={leftX} y2={midY} stroke={color} strokeWidth={width} />);
          } else if (cx > rightX) {
            lines.push(<line key={`h-r-${idx}`} x1={rightX} y1={midY} x2={cx} y2={midY} stroke={color} strokeWidth={width} />);
          }
        } else {
          lines.push(
            <line key={`h-single-${idx}`} x1={cx} y1={midY} x2={offsetChildPositions[0].x} y2={midY}
              stroke={color} strokeWidth={width}
            />
          );
        }

        // Vertical lines to each child
        offsetChildPositions.forEach((cp, ci) => {
          lines.push(
            <line key={`v-up-${idx}-${ci}`} x1={cp.x} y1={midY} x2={cp.x} y2={cp.y}
              stroke={color} strokeWidth={width}
            />
          );
        });
      }
    });

    return lines;
  }, [visibleMembers, positions, connections, findSpouses, svgOffset, collapsedNodes, onToggleCollapse]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  }, [isDragging, startPos]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Mouse wheel zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    if (onZoomChange) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.min(Math.max(zoom + delta, 0.3), 2);
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && onZoomChange) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel, onZoomChange]);

  const svgHeight = useMemo(() => {
    let maxY = 0;
    positions.forEach(({ y }) => {
      if (y > maxY) maxY = y;
    });
    return maxY + CARD_HEIGHT + 200;
  }, [positions]);

  // Auto-position selected generation at top-center when it changes
  useEffect(() => {
    if (selectedGeneration === null) {
      prevSelectedGeneration.current = selectedGeneration;
      return;
    }

    if (selectedGeneration === prevSelectedGeneration.current) return;

    const container = containerRef.current;
    if (!container) {
      prevSelectedGeneration.current = selectedGeneration;
      return;
    }

    const generationMembers = visibleMembers.filter(
      (m) => m.generation === selectedGeneration
    );

    if (generationMembers.length === 0) {
      prevSelectedGeneration.current = selectedGeneration;
      return;
    }

    let minLeft = Infinity;
    let maxRight = -Infinity;
    let minY = Infinity;

    generationMembers.forEach((m) => {
      const pos = positions.get(m.id);
      if (!pos) return;
      minLeft = Math.min(minLeft, pos.x);
      maxRight = Math.max(maxRight, pos.x + CARD_WIDTH);
      minY = Math.min(minY, pos.y);
    });

    if (!Number.isFinite(minLeft) || !Number.isFinite(maxRight) || !Number.isFinite(minY)) {
      prevSelectedGeneration.current = selectedGeneration;
      return;
    }

    const genWidth = Math.max(1, maxRight - minLeft);
    const centerX = (minLeft + maxRight) / 2;

    const topPadding = 30;
    const sidePadding = 24;
    const availableWidth = Math.max(1, container.clientWidth - sidePadding * 2);

    // Only zoom out (never zoom in) to make the selected generation fit on screen
    const fitZoom = availableWidth / genWidth;
    const nextZoom = Math.min(zoom, Math.min(2, Math.max(0.3, fitZoom)));

    if (onZoomChange && nextZoom !== zoom) {
      onZoomChange(nextZoom);
    }

    const targetX = -(centerX * nextZoom);
    const targetY = topPadding - minY * nextZoom;

    setPosition({ x: targetX, y: targetY });
    prevSelectedGeneration.current = selectedGeneration;
  }, [selectedGeneration, visibleMembers, positions, zoom, onZoomChange]);

  // Auto-center on first search match when search query changes
  useEffect(() => {
    if (searchQuery.trim() !== "" && searchQuery !== prevSearchQuery.current) {
      const topOffset = 0; // must match the `top` style of .tree-content

      // Find the first matching member (in currently visible nodes)
      const matchedMember = visibleMembers.find((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );

      if (matchedMember) {
        const pos = positions.get(matchedMember.id);
        if (pos) {
          const containerHeight = containerRef.current?.clientHeight || 600;

          // X axis is centered by `left: 50%`, so we only need to offset by the member position.
          const targetX = -(pos.x * zoom) - (CARD_WIDTH * zoom / 2);
          const targetY =
            containerHeight / 2 -
            topOffset -
            pos.y * zoom -
            (CARD_HEIGHT * zoom) / 2;

          setPosition({ x: targetX, y: targetY });
        }
      }
    }
    prevSearchQuery.current = searchQuery;
  }, [searchQuery, visibleMembers, positions, zoom]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={cn(
        "relative w-full h-[calc(100vh-200px)] min-h-[600px] overflow-hidden rounded-lg border bg-card",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      <div
        className="tree-content absolute"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "top center",
          left: "50%",
          top: "0",
        }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          className="absolute pointer-events-none"
          style={{ left: -svgWidth / 2, top: 0 }}
        >
          {renderConnections()}
        </svg>

        {visibleMembers.map((member) => {
          const pos = positions.get(member.id);
          if (!pos) return null;

          const spouses = findSpouses(member);
          const isChildOfHovered = hoveredMemberId && member.parentId === hoveredMemberId;
          const isChildOfHoveredSpouse = spouses.length > 0 && hoveredMemberId &&
            members.find(m => m.id === hoveredMemberId)?.spouseIds?.includes(member.parentId || '');

          // Check if member matches search query
          const isSearchMatch = searchQuery.trim() !== "" &&
            member.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

          return (
            <div
              key={member.id}
              className="absolute"
              style={{ left: pos.x, top: pos.y }}
            >
              <FamilyMemberCard
                member={member}
                isSelected={selectedMemberId === member.id}
                isHighlighted={!!isChildOfHovered || !!isChildOfHoveredSpouse}
                isSearchMatch={isSearchMatch}
                onClick={() => onMemberClick(member)}
                onMouseEnter={() => onMemberHover?.(member.id)}
                onMouseLeave={() => onMemberHover?.(null)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
