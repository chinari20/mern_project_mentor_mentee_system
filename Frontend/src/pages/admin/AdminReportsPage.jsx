import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function AdminReportsPage() {
  const { data, loading } = useFetch(() => dataService.adminDashboard(), []);

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="Reports & Analytics" description="High-level analytics snapshot for demo and project presentation." />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-950">Platform Summary</h3>
          <p className="mt-4 text-slate-600">Users: {data?.stats?.users || 0}</p>
          <p className="mt-2 text-slate-600">Mentors: {data?.stats?.mentors || 0}</p>
          <p className="mt-2 text-slate-600">Mentees: {data?.stats?.mentees || 0}</p>
          <p className="mt-2 text-slate-600">Sessions: {data?.stats?.sessions || 0}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-950">Moderation Queue</h3>
          <p className="mt-4 text-slate-600">Pending mentor approvals: {data?.stats?.pendingApprovals || 0}</p>
          <p className="mt-2 text-slate-600">Categories configured: {data?.stats?.categories || 0}</p>
          <p className="mt-2 text-slate-600">Total reviews: {data?.stats?.reviews || 0}</p>
        </div>
      </div>
    </div>
  );
}
