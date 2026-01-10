import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ZoomIn, ZoomOut, RotateCcw, Plus, Users, Search } from "lucide-react";

interface TreeControlsProps {
  zoom: number;
  selectedGeneration: number | null;
  totalGenerations: number;
  minGeneration: number;
  memberCount: number;
  searchQuery: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onGenerationChange: (gen: number | null) => void;
  onAddMember: () => void;
  onSearchChange: (query: string) => void;
}

export const TreeControls = ({
  zoom,
  selectedGeneration,
  totalGenerations,
  minGeneration,
  memberCount,
  searchQuery,
  onZoomIn,
  onZoomOut,
  onReset,
  onGenerationChange,
  onAddMember,
  onSearchChange,
}: TreeControlsProps) => {
  const generationCount = totalGenerations - minGeneration + 1;

  const getGenerationLabel = (gen: number) => {
    if (gen === -1) return "Thủy Tổ (Đời -1)";
    if (gen === 0) return "Tổ tiên (Đời 0)";
    return `Đời thứ ${gen}`;
  };
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 w-48"
        />
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          disabled={zoom <= 0.3}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border" />

      {/* Generation Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Lọc theo đời:</span>
        <Select
          value={selectedGeneration?.toString() || "all"}
          onValueChange={(val) =>
            onGenerationChange(val === "all" ? null : parseInt(val))
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tất cả đời" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đời</SelectItem>
            {Array.from({ length: generationCount }, (_, i) => {
              const gen = minGeneration + i;
              return (
                <SelectItem key={gen} value={gen.toString()}>
                  {getGenerationLabel(gen)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border" />

      {/* Member Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{memberCount} thành viên</span>
      </div>

      {/* Add Member Button */}
      <Button onClick={onAddMember} className="ml-auto">
        <Plus className="w-4 h-4 mr-2" />
        Thêm thành viên
      </Button>
    </div>
  );
};
