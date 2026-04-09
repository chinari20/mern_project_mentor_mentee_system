import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MentorMenteesPage() {
  const { data, loading } = useFetch(() => dataService.getRequests(), []);

  if (loading) return <Loader />;

  const activeMentees = (data || []).filter((item) => item.status === "accepted");

  return (
    <div>
      <SectionHeading title="Active Mentees" description="Mentees currently accepted into your mentoring pipeline." />
      <div className="grid gap-6 md:grid-cols-2">
        {activeMentees.map((item) => (
          <div key={item._id} className="card p-6">
            <h3 className="text-xl font-bold text-slate-950">{item.menteeId?.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.menteeId?.email}</p>
            <p className="mt-4 text-sm text-slate-600">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
