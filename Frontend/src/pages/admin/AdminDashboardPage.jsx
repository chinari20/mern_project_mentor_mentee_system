import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { SectionHeading } from "../../components/common/SectionHeading";
import { StatCard } from "../../components/common/StatCard";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function AdminDashboardPage() {
  const { data, loading } = useFetch(() => dataService.adminDashboard(), []);

  if (loading) return <Loader />;

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      <SectionHeading title="Admin Dashboard" description="Monitor platform health and moderate the network." />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.users || 0} />
        <StatCard label="Mentors" value={stats.mentors || 0} />
        <StatCard label="Mentees" value={stats.mentees || 0} />
        <StatCard label="Sessions" value={stats.sessions || 0} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Pending Approvals" value={stats.pendingApprovals || 0} />
        <StatCard label="Reviews" value={stats.reviews || 0} />
        <StatCard label="Categories" value={stats.categories || 0} />
      </div>
      <div className="card p-6">
        {stats.users ? (
          <p className="text-sm text-slate-600">
            The platform currently has {stats.users} users, including {stats.mentors} mentors and {stats.mentees} mentees.
            There are {stats.pendingApprovals || 0} mentor approvals waiting for review.
          </p>
        ) : (
          <EmptyState
            title="No analytics yet"
            description="Stats will appear once the platform has users and activity."
          />
        )}
      </div>
    </div>
  );
}
