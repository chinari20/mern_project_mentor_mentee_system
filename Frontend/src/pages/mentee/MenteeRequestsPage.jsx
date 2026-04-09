import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MenteeRequestsPage() {
  const navigate = useNavigate();
  const { data, loading, setData } = useFetch(() => dataService.getRequests(), []);

  const handleWithdraw = async (id) => {
    try {
      await dataService.updateRequest(id, { status: "rejected" });
      setData((prev) => prev.map((item) => (item._id === id ? { ...item, status: "rejected" } : item)));
      toast.success("Request updated");
    } catch (error) {
      toast.error(error.message || "Unable to update request");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="My Requests" description="Track sent mentorship requests and their status." />
      <div className="space-y-4">
        {(data || []).map((request) => (
          <div key={request._id} className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">{request.mentorId?.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{request.message}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={request.status === "accepted" ? "success" : request.status === "rejected" ? "danger" : "warning"}>
                {request.status}
              </Badge>
              {request.status === "pending" ? (
                <Button variant="secondary" onClick={() => handleWithdraw(request._id)}>
                  Cancel
                </Button>
              ) : null}
              {request.status === "accepted" ? (
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/mentee/messages?userId=${request.mentorId?._id || ""}`)}
                  disabled={!request.mentorId?._id}
                >
                  Open chat
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
