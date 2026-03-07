import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZoomIn, ZoomOut, RotateCcw, Plus, Users, Search, Maximize2, Minimize2 } from "lucide-react";

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
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
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
  isFullscreen,
  onToggleFullscreen,
}: TreeControlsProps) => {
  const generationCount = totalGenerations - minGeneration + 1;

  const getGenerationLabel = (gen: number) => {
    if (gen === -1) return "Thủy Tổ (Đời -1)";
    if (gen === 0) return "Tổ tiên (Đời 0)";
    return `Đời thứ ${gen}`;
  };
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-52 border-[#E2E8F0] pl-8 focus-visible:ring-[#16A34A]/20"
        />
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-[#E2E8F0]" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          disabled={zoom <= 0.3}
          className="border-[#E2E8F0] hover:bg-[#F8FAF8]"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="w-16 text-center text-sm font-medium text-[#0F172A]">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          disabled={zoom >= 2}
          className="border-[#E2E8F0] hover:bg-[#F8FAF8]"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onReset} className="border-[#E2E8F0] hover:bg-[#F8FAF8]">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-[#E2E8F0]" />

      {/* Generation Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#64748B]">Lọc theo đời:</span>
        <Select
          value={selectedGeneration?.toString() || "all"}
          onValueChange={(val) =>
            onGenerationChange(val === "all" ? null : parseInt(val))
          }
        >
          <SelectTrigger className="w-40 border-[#E2E8F0]">
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
      <div className="h-8 w-px bg-[#E2E8F0]" />

      {/* Member Count */}
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <Users className="w-4 h-4" />
        <span>{memberCount} thành viên</span>
      </div>

      {/* Add Member Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onToggleFullscreen}
        className="ml-auto border-[#E2E8F0] hover:bg-[#F8FAF8]"
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 mr-2" />
        ) : (
          <Maximize2 className="w-4 h-4 mr-2" />
        )}
        {isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      </Button>

      <Button onClick={onAddMember} className="bg-[#16A34A] text-white hover:bg-[#15803D]">
        <Plus className="w-4 h-4 mr-2" />
        Thêm thành viên
      </Button>
    </div>
  );
};
