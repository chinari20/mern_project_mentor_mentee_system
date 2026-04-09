import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Textarea } from "../../components/common/Textarea";
import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";
import { formatCurrency, formatTimeRange } from "../../utils/formatters";

export default function MentorDetailsPage() {
  const { id } = useParams();
  const { user, profile, refresh } = useAuth();
  const { data, loading } = useFetch(() => dataService.getMentor(id), [id]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Loader />;

  const mentor = data?.mentor;
  const reviews = data?.reviews || [];

  if (!mentor) {
    return (
      <section className="container-app py-20">
        <EmptyState
          title="Mentor not found"
          description="This profile is unavailable or no longer publicly listed."
        />
      </section>
    );
  }

  const availability = mentor?.availability || [];
  const portfolioLinks = mentor?.portfolioLinks || {};
  const favoriteIds = new Set((profile?.favorites || []).map((favorite) => favorite._id || favorite));
  const isFavorite = favoriteIds.has(mentor?.userId?._id);

  const handleRequest = async () => {
    if (!message.trim()) {
      toast.error("Add a short message before sending the request");
      return;
    }

    try {
      setSubmitting(true);
      await dataService.createRequest({
        mentorId: mentor.userId._id,
        message: message.trim(),
        goals: ["Guided learning", "Structured feedback"],
        preferredTime: "Weekday evenings",
      });
      toast.success("Request sent");
      setMessage("");
    } catch (error) {
      toast.error(error.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFavorite = async () => {
    try {
      await dataService.toggleFavorite(mentor.userId._id);
      await refresh();
      toast.success(isFavorite ? "Removed from favorites" : "Saved to favorites");
    } catch (error) {
      toast.error(error.message || "Unable to update favorites");
    }
  };

  return (
    <section className="container-app py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr,360px]">
        <div className="space-y-8">
          <div className="card p-8">
            <Badge variant="info">{mentor.category?.name || "General"}</Badge>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-950">{mentor.userId?.name}</h1>
            <p className="mt-2 text-lg text-slate-600">{mentor.headline}</p>
            <p className="mt-6 text-slate-600">{mentor.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {mentor.expertise?.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-8">
            <SectionHeading title="Reviews" description="Feedback from mentees after completed sessions." />
            {reviews.length ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-2xl border border-slate-100 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-950">{review.menteeId?.name}</p>
                      <Badge variant="warning">{review.rating}/5</Badge>
                    </div>
                    <p className="mt-3 text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No reviews yet"
                description="This mentor has not received any published feedback yet."
              />
            )}
          </div>

          <div className="card p-8">
            <SectionHeading
              title="Availability"
              description="Typical weekly windows the mentor has opened for sessions."
            />
            {availability.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {availability.map((slot, index) => (
                  <div key={`${slot.day}-${index}`} className="rounded-2xl border border-slate-100 p-5">
                    <p className="font-semibold text-slate-950">{slot.day}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      {formatTimeRange(slot.startTime, slot.endTime)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{slot.timezone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Availability not shared yet"
                description="Reach out with your preferred time window and the mentor can coordinate directly."
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <p className="text-sm text-slate-500">Session Fee</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950">{formatCurrency(mentor.fee)}</p>
            <p className="mt-4 text-sm text-slate-500">Experience</p>
            <p className="font-semibold text-slate-950">{mentor.experience} years</p>
            <p className="mt-4 text-sm text-slate-500">Languages</p>
            <p className="font-semibold text-slate-950">{mentor.languages?.join(", ") || "Not specified"}</p>
            <p className="mt-4 text-sm text-slate-500">Total Reviews</p>
            <p className="font-semibold text-slate-950">{mentor.totalReviews || reviews.length}</p>
          </div>

          {user?.role === "mentee" ? (
            <div className="card space-y-4 p-6">
              <h3 className="text-xl font-bold text-slate-950">Send mentorship request</h3>
              <Button variant="secondary" className="w-full" onClick={handleFavorite}>
                {isFavorite ? "Remove from Favorites" : "Save to Favorites"}
              </Button>
              <Textarea
                label="Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Explain your goals and what kind of support you need"
              />
              <Button className="w-full" onClick={handleRequest} disabled={submitting}>
                {submitting ? "Sending..." : "Request Mentorship"}
              </Button>
            </div>
          ) : null}

          {portfolioLinks.linkedin || portfolioLinks.github || portfolioLinks.portfolio ? (
            <div className="card p-6">
              <h3 className="text-xl font-bold text-slate-950">Links</h3>
              <div className="mt-4 space-y-2 text-sm">
                {portfolioLinks.linkedin ? (
                  <a className="block text-primary-600" href={portfolioLinks.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                ) : null}
                {portfolioLinks.github ? (
                  <a className="block text-primary-600" href={portfolioLinks.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                ) : null}
                {portfolioLinks.portfolio ? (
                  <a className="block text-primary-600" href={portfolioLinks.portfolio} target="_blank" rel="noreferrer">
                    Portfolio
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
