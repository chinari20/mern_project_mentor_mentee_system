import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MentorRequestsPage() {
  const { data, loading, setData } = useFetch(() => dataService.getRequests(), []);

  const handleDecision = async (id, status) => {
    try {
      await dataService.updateRequest(id, { status });
      setData((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
      toast.success(`Request ${status}`);
    } catch (error) {
      toast.error(error.message || "Unable to update request");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="Request Management" description="Review incoming requests and accept or reject them." />
      <div className="space-y-4">
        {(data || []).map((request) => (
          <div key={request._id} className="card p-6">
            <h3 className="text-lg font-bold text-slate-950">{request.menteeId?.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{request.message}</p>
            {request.status === "pending" ? (
              <div className="mt-4 flex gap-3">
                <Button onClick={() => handleDecision(request._id, "accepted")}>Accept</Button>
                <Button variant="secondary" onClick={() => handleDecision(request._id, "rejected")}>Reject</Button>
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold capitalize text-primary-600">{request.status}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
