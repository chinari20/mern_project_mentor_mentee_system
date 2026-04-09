import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Textarea } from "../../components/common/Textarea";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function AdminCategoriesPage() {
  const { data, loading, setData } = useFetch(() => dataService.adminCategories(), []);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleCreate = async () => {
    try {
      const response = await dataService.createCategory(form);
      setData((prev) => [...(prev || []), response.data.data]);
      setForm({ name: "", description: "" });
      toast.success("Category created");
    } catch (error) {
      toast.error(error.message || "Unable to create category");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <SectionHeading title="Category Management" description="Organize mentor domains and discovery taxonomy." />
      <div className="card grid gap-4 p-6 md:grid-cols-2">
        <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="button" onClick={handleCreate}>Add Category</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {(data || []).map((category) => (
          <div key={category._id} className="card p-6">
            <h3 className="text-lg font-bold text-slate-950">{category.name}</h3>
            <p className="mt-2 text-slate-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
