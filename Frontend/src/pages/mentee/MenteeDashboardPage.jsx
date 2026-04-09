import { StatCard } from "../../components/common/StatCard";
import { EmptyState } from "../../components/common/EmptyState";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Loader } from "../../components/common/Loader";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";
import { formatTimeRange } from "../../utils/formatters";

export default function MenteeDashboardPage() {
  const { data: requests, loading: requestsLoading } = useFetch(() => dataService.getRequests(), []);
  const { data: sessions, loading: sessionsLoading } = useFetch(() => dataService.getSessions(), []);
  const { data: goals, loading: goalsLoading } = useFetch(() => dataService.getGoals(), []);
  const { data: notifications, loading: notificationsLoading } = useFetch(
    () => dataService.getNotifications(),
    [],
  );

  if (requestsLoading || sessionsLoading || goalsLoading || notificationsLoading) {
    return <Loader />;
  }

  const activeMentors = (requests || []).filter((request) => request.status === "accepted");
  const upcomingSessions = (sessions || []).filter((session) =>
    ["pending", "confirmed"].includes(session.status),
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Mentee Dashboard"
        title="Your mentorship overview"
        description="Track current mentors, sessions, goals, and platform updates from one place."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sent Requests" value={requests?.length || 0} />
        <StatCard label="Active Mentors" value={activeMentors.length} />
        <StatCard label="Upcoming Sessions" value={upcomingSessions.length} />
        <StatCard label="Learning Goals" value={goals?.length || 0} />
        <StatCard label="Notifications" value={notifications?.length || 0} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-950">My Mentors</h3>
          <div className="mt-4 space-y-4">
            {activeMentors.length ? (
              activeMentors.map((request) => (
                <div key={request._id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="font-semibold text-slate-900">{request.mentorId?.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{request.mentorId?.email}</p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No active mentors"
                description="Send requests to mentors you want to learn from."
              />
            )}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-950">Upcoming Sessions</h3>
          <div className="mt-4 space-y-4">
            {upcomingSessions.length ? (
              upcomingSessions.slice(0, 4).map((session) => (
                <div key={session._id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="font-semibold text-slate-900">{session.topic}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {session.mentorId?.name} • {session.date} • {formatTimeRange(session.startTime, session.endTime)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No sessions booked"
                description="Book a session with an accepted mentor from the sessions page."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
