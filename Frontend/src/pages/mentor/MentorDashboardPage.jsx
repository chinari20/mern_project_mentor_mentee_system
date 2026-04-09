import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { SectionHeading } from "../../components/common/SectionHeading";
import { StatCard } from "../../components/common/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";
import { formatTimeRange } from "../../utils/formatters";

export default function MentorDashboardPage() {
  const { data, loading } = useFetch(() => dataService.mentorDashboard(), []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Mentor Dashboard"
        title="Manage your mentee pipeline"
        description="Track requests, active mentees, upcoming sessions, and review activity."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending Requests" value={data?.stats?.pendingRequests || 0} />
        <StatCard label="Active Mentees" value={data?.stats?.activeMentees || 0} />
        <StatCard label="Sessions" value={data?.stats?.sessions || 0} />
        <StatCard label="Reviews" value={data?.stats?.reviews || 0} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-950">Pending Requests</h3>
          <div className="mt-4 space-y-4">
            {data?.pendingRequests?.length ? (
              data.pendingRequests.map((request) => (
                <div key={request._id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="font-semibold text-slate-900">{request.menteeId?.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{request.message}</p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No pending requests"
                description="New mentor requests will appear here."
              />
            )}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-950">Upcoming Sessions</h3>
          <div className="mt-4 space-y-4">
            {data?.upcomingSessions?.length ? (
              data.upcomingSessions.slice(0, 4).map((session) => (
                <div key={session._id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="font-semibold text-slate-900">{session.topic}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {session.menteeId?.name} • {session.date} • {formatTimeRange(session.startTime, session.endTime)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="No sessions scheduled"
                description="Accepted mentees can be scheduled from the sessions page."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
