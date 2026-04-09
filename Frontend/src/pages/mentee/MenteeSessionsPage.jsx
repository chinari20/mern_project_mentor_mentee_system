import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { Loader } from "../../components/common/Loader";
import { Select } from "../../components/common/Select";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Textarea } from "../../components/common/Textarea";
import { Badge } from "../../components/common/Badge";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";
import { formatTimeRange } from "../../utils/formatters";

export default function MenteeSessionsPage() {
  const { data, loading, setData } = useFetch(() => dataService.getSessions(), []);
  const { data: requests, loading: requestsLoading } = useFetch(() => dataService.getRequests(), []);
  const { data: mentors, loading: mentorsLoading } = useFetch(() => dataService.getMentors(), []);
  const { data: reviews, loading: reviewsLoading, setData: setReviews } = useFetch(
    () => dataService.getReviews({ menteeId: "me" }),
    [],
  );
  const [bookingForm, setBookingForm] = useState({
    mentorId: "",
    date: "",
    startTime: "",
    endTime: "",
    topic: "",
    meetLink: "",
    notes: "",
  });
  const [reviewForms, setReviewForms] = useState({});

  const acceptedRequests = (requests || []).filter((request) => request.status === "accepted");
  const mentorOptions = [
    { value: "", label: "Select mentor" },
    ...acceptedRequests.map((request) => ({
      value: request.mentorId?._id,
      label: request.mentorId?.name || "Unknown mentor",
    })),
  ];

  const selectedMentor = (mentors || []).find((mentor) => mentor.user?._id === bookingForm.mentorId);

  const reviewedSessionIds = useMemo(
    () => new Set((reviews || []).map((review) => review.sessionId?._id || review.sessionId)),
    [reviews],
  );

  const handleBooking = async () => {
    if (!bookingForm.mentorId) {
      toast.error("Select a mentor first");
      return;
    }

    try {
      const response = await dataService.createSession({
        ...bookingForm,
        status: "pending",
      });
      setData((current) => [response.data.data, ...(current || [])]);
      setBookingForm({
        mentorId: "",
        date: "",
        startTime: "",
        endTime: "",
        topic: "",
        meetLink: "",
        notes: "",
      });
      toast.success("Session request sent");
    } catch (error) {
      toast.error(error.message || "Unable to book session");
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      const response = await dataService.updateSession(sessionId, { status });
      setData((current) =>
        current.map((session) => (session._id === sessionId ? response.data.data : session)),
      );
      toast.success(`Session ${status}`);
    } catch (error) {
      toast.error(error.message || "Unable to update session");
    }
  };

  const handleReviewSubmit = async (session) => {
    const form = reviewForms[session._id] || { rating: "5", comment: "" };

    try {
      const response = await dataService.createReview({
        mentorId: session.mentorId?._id,
        sessionId: session._id,
        rating: Number(form.rating || 5),
        comment: form.comment,
      });
      setReviews((current) => [...(current || []), response.data.data]);
      toast.success("Review submitted");
    } catch (error) {
      toast.error(error.message || "Unable to submit review");
    }
  };

  if (loading || reviewsLoading || requestsLoading || mentorsLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <SectionHeading title="My Sessions" description="Review session bookings, topics, and current status." />
      <div className="card grid gap-4 p-6 md:grid-cols-2">
        <Select
          label="Mentor"
          options={mentorOptions}
          value={bookingForm.mentorId}
          onChange={(event) => setBookingForm({ ...bookingForm, mentorId: event.target.value })}
        />
        <Input
          label="Date"
          type="date"
          value={bookingForm.date}
          onChange={(event) => setBookingForm({ ...bookingForm, date: event.target.value })}
        />
        <Input
          label="Start Time"
          type="time"
          value={bookingForm.startTime}
          onChange={(event) => setBookingForm({ ...bookingForm, startTime: event.target.value })}
        />
        <Input
          label="End Time"
          type="time"
          value={bookingForm.endTime}
          onChange={(event) => setBookingForm({ ...bookingForm, endTime: event.target.value })}
        />
        <Input
          label="Topic"
          value={bookingForm.topic}
          onChange={(event) => setBookingForm({ ...bookingForm, topic: event.target.value })}
        />
        <Input
          label="Meeting Link"
          value={bookingForm.meetLink}
          onChange={(event) => setBookingForm({ ...bookingForm, meetLink: event.target.value })}
        />
        <div className="md:col-span-2">
          <Textarea
            label="Notes"
            value={bookingForm.notes}
            onChange={(event) => setBookingForm({ ...bookingForm, notes: event.target.value })}
          />
        </div>
        <Button type="button" onClick={handleBooking}>
          Book Session
        </Button>
        {selectedMentor?.availability?.length ? (
          <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Available windows</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedMentor.availability.map((slot, index) => (
                <span key={`${slot.day}-${index}`} className="rounded-full bg-white px-3 py-2 text-sm text-slate-600">
                  {slot.day}: {formatTimeRange(slot.startTime, slot.endTime)}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {!acceptedRequests.length ? (
        <EmptyState
          title="No accepted mentors yet"
          description="A mentor needs to accept your request before you can book a session."
        />
      ) : null}
      <div className="space-y-4">
        {(data || []).map((session) => (
          <div key={session._id} className="card p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">{session.topic}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Mentor: {session.mentorId?.name} | {session.date} | {formatTimeRange(session.startTime, session.endTime)}
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
              <Badge variant={session.status === "confirmed" ? "success" : "warning"}>{session.status}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {session.status === "confirmed" ? (
                <Button variant="secondary" type="button" onClick={() => handleStatusUpdate(session._id, "cancelled")}>
                  Cancel Session
                </Button>
              ) : null}
            </div>
            {session.status === "completed" && !reviewedSessionIds.has(session._id) ? (
              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-100 p-4 md:grid-cols-2">
                <Input
                  label="Rating"
                  type="number"
                  min="1"
                  max="5"
                  value={reviewForms[session._id]?.rating || "5"}
                  onChange={(event) =>
                    setReviewForms((current) => ({
                      ...current,
                      [session._id]: {
                        rating: event.target.value,
                        comment: current[session._id]?.comment || "",
                      },
                    }))
                  }
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Review"
                    value={reviewForms[session._id]?.comment || ""}
                    onChange={(event) =>
                      setReviewForms((current) => ({
                        ...current,
                        [session._id]: {
                          rating: current[session._id]?.rating || "5",
                          comment: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <Button type="button" onClick={() => handleReviewSubmit(session)}>
                  Submit Review
                </Button>
              </div>
            ) : null}
            {reviewedSessionIds.has(session._id) ? (
              <p className="mt-4 text-sm font-semibold text-emerald-600">Review submitted</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
