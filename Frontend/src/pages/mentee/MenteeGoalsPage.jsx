import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Select } from "../../components/common/Select";
import { Textarea } from "../../components/common/Textarea";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MenteeGoalsPage() {
  const { data, loading, setData } = useFetch(() => dataService.getGoals(), []);
  const { data: requests, loading: requestsLoading } = useFetch(() => dataService.getRequests(), []);
  const [form, setForm] = useState({ title: "", description: "", mentorId: "" });

  const acceptedMentors = (requests || []).filter((request) => request.status === "accepted");
  const mentorOptions = [
    { value: "", label: "Select a mentor" },
    ...acceptedMentors.map((request) => ({
      value: request.mentorId?._id,
      label: request.mentorId?.name || "Unknown mentor",
    })),
  ];

  const handleCreate = async () => {
    if (!form.mentorId) {
      toast.error("Select an accepted mentor first");
      return;
    }

    try {
      const response = await dataService.createGoal({ ...form, progress: 0, status: "not-started" });
      setData((prev) => [response.data.data, ...(prev || [])]);
      setForm({ title: "", description: "", mentorId: "" });
      toast.success("Goal created");
    } catch (error) {
      toast.error(error.message || "Unable to create goal");
    }
  };

  if (loading || requestsLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <SectionHeading title="Learning Goals" description="Create and monitor structured milestones with mentor feedback." />
      <div className="card grid gap-4 p-6 md:grid-cols-3">
        <Input label="Goal Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Select
          label="Mentor"
          options={mentorOptions}
          value={form.mentorId}
          onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
        />
        <div className="md:col-span-3">
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="button" onClick={handleCreate}>Create Goal</Button>
      </div>
      {!acceptedMentors.length ? (
        <EmptyState
          title="No active mentor relationships"
          description="Accept a mentorship first before attaching goals to a mentor."
        />
      ) : null}
      <div className="space-y-4">
        {(data || []).map((goal) => (
          <div key={goal._id} className="card p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">{goal.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{goal.description}</p>
                <p className="mt-2 text-sm text-slate-500">Mentor: {goal.mentorId?.name || "Not assigned"}</p>
              </div>
              <p className="text-sm font-semibold text-primary-600">{goal.progress}% complete</p>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-primary-500" style={{ width: `${goal.progress}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-500">Feedback: {goal.mentorFeedback || "Awaiting mentor update"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
