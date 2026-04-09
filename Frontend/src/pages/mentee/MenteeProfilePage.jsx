import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Textarea } from "../../components/common/Textarea";
import { useAuth } from "../../hooks/useAuth";
import { dataService } from "../../services/dataService";

export default function MenteeProfilePage() {
  const { profile, refresh } = useAuth();
  const [form, setForm] = useState({
    education: "",
    interests: "",
    careerGoals: "",
    skillsToLearn: "",
    preferredDomains: "",
    bio: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      education: profile.education || "",
      interests: (profile.interests || []).join(", "),
      careerGoals: (profile.careerGoals || []).join(", "),
      skillsToLearn: (profile.skillsToLearn || []).join(", "),
      preferredDomains: (profile.preferredDomains || []).join(", "),
      bio: profile.bio || "",
    });
  }, [profile]);

  const handleSave = async () => {
    try {
      await dataService.updateProfile({
        ...form,
        interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean),
        careerGoals: form.careerGoals.split(",").map((item) => item.trim()).filter(Boolean),
        skillsToLearn: form.skillsToLearn.split(",").map((item) => item.trim()).filter(Boolean),
        preferredDomains: form.preferredDomains.split(",").map((item) => item.trim()).filter(Boolean),
      });
      await refresh();
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  return (
    <div>
      <SectionHeading title="Edit Profile" description="Keep your learning preferences and goals current." />
      <div className="card grid gap-5 p-6 md:grid-cols-2">
        <Input label="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
        <Input label="Interests" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
        <Input label="Career Goals" value={form.careerGoals} onChange={(e) => setForm({ ...form, careerGoals: e.target.value })} />
        <Input label="Skills to Learn" value={form.skillsToLearn} onChange={(e) => setForm({ ...form, skillsToLearn: e.target.value })} />
        <Input label="Preferred Domains" value={form.preferredDomains} onChange={(e) => setForm({ ...form, preferredDomains: e.target.value })} />
        <div className="md:col-span-2">
          <Textarea label="Short Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <Button type="button" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
