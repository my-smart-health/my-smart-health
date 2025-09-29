import {
  CATEGORY_FACHARZTE,
  PROFILE_TYPE_MEDIZIN_UND_PFLEGE,
  PROFILE_TYPE_SMART_HEALTH,
  SUB_CATEGORYES_OF_MEDIZIN_UND_PFLEGE_FACHAERZTE,
} from "@/utils/constants";

export default function CategoryInputList({
  profileType,
  categoryState,
  setCategoryState,
}: {
  profileType: string;
  categoryState: string[];
  setCategoryState: (cats: string[]) => void;
}) {
  return (
    <div className="flex flex-col w-full gap-2">
      {categoryState.map((cat, index) => {
        if (profileType === PROFILE_TYPE_SMART_HEALTH) {
          return (
            <div key={index} className="flex flex-col gap-2 max-w-full">
              <label htmlFor={`category-${index}`}>
                {index === 0 ? "Category" : `Sub category ${index + 1}`}
              </label>
              <input
                type="text"
                value={cat}
                onChange={(e) => {
                  const newCategories = [...categoryState];
                  newCategories[index] = e.target.value;
                  setCategoryState(newCategories);
                }}
                placeholder={index === 0 ? "Category" : "Sub category"}
                className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const newCategories = [...categoryState];
                  newCategories.splice(index, 1);
                  setCategoryState(newCategories);
                }}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer place-self-end"
              >
                Remove
              </button>
            </div>
          );
        }
        else if (profileType === PROFILE_TYPE_MEDIZIN_UND_PFLEGE) {
          const isFachaerzte = categoryState[0]?.trim() === CATEGORY_FACHARZTE;
          if (index === 0) {
            return (
              <div key={index} className="flex flex-col gap-2 max-w-full">
                <label>Category</label>
                <input
                  type="text"
                  value={cat}
                  list="category-fachaerzte-suggestion"
                  onChange={(e) => {
                    const newCategories = [...categoryState];
                    newCategories[index] = e.target.value;
                    setCategoryState(newCategories);
                  }}
                  placeholder="Category"
                  className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <datalist id="category-fachaerzte-suggestion">
                  <option value={CATEGORY_FACHARZTE} />
                </datalist>
                <button
                  type="button"
                  onClick={() => {
                    const newCategories = [...categoryState];
                    newCategories.splice(index, 1);
                    setCategoryState(newCategories);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer place-self-end"
                >
                  Remove
                </button>
              </div>
            );
          }
          const isSubCategory = index > 0 && isFachaerzte;
          return (
            <div key={index} className="flex flex-col gap-2 max-w-full">
              <label>{`Sub category ${index}`}</label>
              <input
                type="text"
                value={cat}
                list={isSubCategory ? `category-suggestions-${index}` : undefined}
                onChange={(e) => {
                  const newCategories = [...categoryState];
                  newCategories[index] = e.target.value;
                  setCategoryState(newCategories);
                }}
                placeholder="Sub category"
                className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {isSubCategory && (
                <datalist id={`category-suggestions-${index}`}>
                  {SUB_CATEGORYES_OF_MEDIZIN_UND_PFLEGE_FACHAERZTE.map((subCat, subIndex) => (
                    <option key={subIndex} value={subCat} />
                  ))}
                </datalist>
              )}
              <button
                type="button"
                onClick={() => {
                  const newCategories = [...categoryState];
                  newCategories.splice(index, 1);
                  setCategoryState(newCategories);
                }}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer place-self-end"
              >
                Remove
              </button>
            </div>
          );
        }
        return null;
      })}

      <button
        type="button"
        onClick={() => setCategoryState([...categoryState, ""])}
        className="p-2 rounded bg-primary text-white font-bold text-base hover:bg-primary/80 transition-colors w-full"
      >
        {categoryState.length < 1 ? "Add Category" : "Add Subcategory"}
      </button>
    </div>
  );
}