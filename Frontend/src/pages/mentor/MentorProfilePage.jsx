import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { Select } from "../../components/common/Select";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Textarea } from "../../components/common/Textarea";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MentorProfilePage() {
  const { profile, refresh } = useAuth();
  const { data: categories, loading } = useFetch(() => dataService.getCategories(), []);
  const [form, setForm] = useState({
    headline: "",
    bio: "",
    expertise: "",
    experience: "",
    languages: "",
    fee: "",
    category: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      headline: profile.headline || "",
      bio: profile.bio || "",
      expertise: (profile.expertise || []).join(", "),
      experience: profile.experience || "",
      languages: (profile.languages || []).join(", "),
      fee: profile.fee || "",
      category: profile.category?._id || "",
      linkedin: profile.portfolioLinks?.linkedin || "",
      github: profile.portfolioLinks?.github || "",
      portfolio: profile.portfolioLinks?.portfolio || "",
    });
  }, [profile]);

  const handleSave = async () => {
    try {
      await dataService.updateProfile({
        ...form,
        experience: Number(form.experience || 0),
        fee: Number(form.fee || 0),
        category: form.category || undefined,
        expertise: form.expertise.split(",").map((item) => item.trim()).filter(Boolean),
        languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean),
        portfolioLinks: {
          linkedin: form.linkedin.trim(),
          github: form.github.trim(),
          portfolio: form.portfolio.trim(),
        },
      });
      await refresh();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message || "Unable to update profile");
    }
  };

  if (loading) return <Loader />;

  const categoryOptions = [
    { value: "", label: "Select category" },
    ...((categories || []).map((category) => ({
      value: category._id,
      label: category.name,
    }))),
  ];

  return (
    <div>
      <SectionHeading title="Mentor Profile" description="Keep your expertise, fee, and positioning sharp for discovery." />
      <div className="card grid gap-5 p-6 md:grid-cols-2">
        <Input label="Headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        <Input label="Expertise" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
        <Input label="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <Input label="Languages" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
        <Input label="Session Fee" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
        <Select label="Category" options={categoryOptions} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input label="LinkedIn" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        <Input label="GitHub" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
        <Input label="Portfolio" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <Button type="button" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
