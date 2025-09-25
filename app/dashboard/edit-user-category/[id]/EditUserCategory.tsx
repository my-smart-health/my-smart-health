'use client';
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { useState } from "react";

type EditUserCategoryProps = {
  initialCategories: string[];
  onSaveAction: (categories: string[]) => Promise<void>;
};

export default function EditUserCategory({
  initialCategories,
  onSaveAction,
}: EditUserCategoryProps) {
  const [categories, setCategories] = useState<string[]>(initialCategories ?? []);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory("");
    }
  };

  const removeCategory = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const moveCategory = (idx: number, dir: -1 | 1) => {
    const arr = [...categories];
    const [item] = arr.splice(idx, 1);
    arr.splice(idx + dir, 0, item);
    setCategories(arr);
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    await onSaveAction(categories);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <label className="font-semibold">Kategorien (Hierarchie):</label>
      <ul className="flex flex-col gap-2">
        {categories.map((cat, idx) => (
          <li key={cat} className="flex justify-between items-center gap-2">
            <span className="badge badge-primary badge-outline">{cat}</span>
            <div className="flex gap-1">
              <button
                type="button"
                className="btn btn-xs"
                disabled={idx === 0}
                onClick={() => moveCategory(idx, -1)}
                aria-label="Nach oben"
                title="Nach oben"
              ><ArrowUp /></button>

              <button
                type="button"
                className="btn btn-xs btn-error"
                onClick={() => removeCategory(idx)}
                aria-label={`Entferne ${cat}`}
                title="Entfernen"
              ><Trash2 /></button>

              <button
                type="button"
                className="btn btn-xs"
                disabled={idx === categories.length - 1}
                onClick={() => moveCategory(idx, 1)}
                aria-label="Nach unten"
                title="Nach unten"
              ><ArrowDown /></button>
            </div>
          </li>
        ))
        }
      </ul >
      <div className="flex gap-2">
        <input
          type="text"
          className="input input-bordered input-primary w-full"
          placeholder="Neue Kategorie"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCategory();
            }
          }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={addCategory}
          disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
        >
          Hinzufügen
        </button>
      </div>
      <button
        type="button"
        className="btn btn-success mt-2"
        onClick={handleSave}
        disabled={categories.length === 0 || loading}
      >
        {loading ? "Speichern..." : "Speichern"}
      </button>
      {success && <div className="alert alert-success">Gespeichert!</div>}
    </div >
  );
}