import toast from "react-hot-toast";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function AdminApprovalsPage() {
  const { data, loading, setData } = useFetch(() => dataService.mentorApprovals(), []);

  const handleApprove = async (id) => {
    try {
      await dataService.approveMentor(id);
      setData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Mentor approved");
    } catch (error) {
      toast.error(error.message || "Unable to approve mentor");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="Mentor Approvals" description="Approve mentor profiles that require moderation." />
      <div className="space-y-4">
        {(data || []).map((mentor) => (
          <div key={mentor._id} className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">{mentor.userId?.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{mentor.headline || mentor.bio}</p>
            </div>
            <button className="btn-primary" onClick={() => handleApprove(mentor._id)}>
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
