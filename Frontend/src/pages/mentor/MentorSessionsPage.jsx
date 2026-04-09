import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Select } from "../../components/common/Select";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";
import { formatTimeRange } from "../../utils/formatters";

export default function MentorSessionsPage() {
  const { data, loading, setData } = useFetch(() => dataService.getSessions(), []);
  const { data: requests, loading: requestsLoading } = useFetch(() => dataService.getRequests(), []);
  const [form, setForm] = useState({
    menteeId: "",
    date: "",
    startTime: "",
    endTime: "",
    topic: "",
    meetLink: "",
  });

  const activeMentees = (requests || []).filter((request) => request.status === "accepted");
  const menteeOptions = [
    { value: "", label: "Select a mentee" },
    ...activeMentees.map((request) => ({
      value: request.menteeId?._id,
      label: request.menteeId?.name || "Unknown mentee",
    })),
  ];

  const handleCreate = async () => {
    if (!form.menteeId) {
      toast.error("Select a mentee first");
      return;
    }

    try {
      const response = await dataService.createSession({ ...form, status: "confirmed" });
      setData((prev) => [response.data.data, ...(prev || [])]);
      toast.success("Session created");
      setForm({ menteeId: "", date: "", startTime: "", endTime: "", topic: "", meetLink: "" });
    } catch (error) {
      toast.error(error.message || "Unable to create session");
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      const response = await dataService.updateSession(sessionId, { status });
      setData((current) =>
        current.map((session) => (session._id === sessionId ? response.data.data : session)),
      );
      toast.success(`Session marked ${status}`);
    } catch (error) {
      toast.error(error.message || "Unable to update session");
    }
  };

  if (loading || requestsLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <SectionHeading title="Session Management" description="Book and manage mentoring sessions with mentees." />
      <div className="card grid gap-4 p-6 md:grid-cols-3">
        <Select
          label="Mentee"
          options={menteeOptions}
          value={form.menteeId}
          onChange={(e) => setForm({ ...form, menteeId: e.target.value })}
        />
        <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <Input label="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
        <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        <Input label="Meet Link" value={form.meetLink} onChange={(e) => setForm({ ...form, meetLink: e.target.value })} />
        <Button type="button" onClick={handleCreate}>Add Session</Button>
      </div>
      {!activeMentees.length ? (
        <EmptyState
          title="No accepted mentees yet"
          description="Accept a mentorship request before scheduling sessions from this page."
        />
      ) : null}
      <div className="space-y-4">
        {(data || []).map((session) => (
          <div key={session._id} className="card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">{session.topic}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {session.date} | {formatTimeRange(session.startTime, session.endTime)} | Mentee: {session.menteeId?.name}
                </p>
                {session.meetLink ? (
                  <a
                    className="mt-3 inline-block text-sm font-semibold text-primary-600"
                    href={session.meetLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open meeting link
                  </a>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                {session.status !== "completed" ? (
                  <Button variant="secondary" type="button" onClick={() => handleStatusUpdate(session._id, "completed")}>
                    Mark Completed
                  </Button>
                ) : null}
                {session.status !== "cancelled" ? (
                  <Button variant="secondary" type="button" onClick={() => handleStatusUpdate(session._id, "cancelled")}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold capitalize text-primary-600">{session.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
