type CategoryFiltersProps = {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
};

export function CategoryFilters({ categories, activeCategory, onSelectCategory }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
