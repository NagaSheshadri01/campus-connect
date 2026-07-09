import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchCategories, type Category } from "@/lib/api";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const allCategories = [{ id: "all", name: "All" }, ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => {
        const key = cat.id === "all" ? "all" : cat.name.toLowerCase();
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(key)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              selected === key
                ? "btn-glow text-foreground shadow-lg"
                : "bg-muted/30 text-muted-foreground border border-border/40 hover:text-foreground hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            {selected === key ? <span className="relative z-10">{cat.name}</span> : cat.name}
          </button>
        );
      })}
    </div>
  );
}
