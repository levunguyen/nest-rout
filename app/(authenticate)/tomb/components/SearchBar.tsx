import { Search, X } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative mx-auto max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Tìm kiếm theo tên, nghĩa trang..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-12 rounded-full border-border/50 bg-card pl-12 pr-12 font-sans shadow-sm transition-shadow focus:shadow-md"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
