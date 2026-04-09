import toast from "react-hot-toast";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function MenteeNotificationsPage() {
  const { data, loading, setData } = useFetch(() => dataService.getNotifications(), []);

  const handleRead = async (id) => {
    try {
      await dataService.markNotificationRead(id);
      setData((prev) => prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
    } catch (error) {
      toast.error(error.message || "Unable to update notification");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="Notifications" description="Keep track of requests, sessions, goals, and messages." />
      <div className="space-y-4">
        {(data || []).map((item) => (
          <div key={item._id} className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.message}</p>
            </div>
            {!item.isRead ? (
              <button className="btn-secondary" onClick={() => handleRead(item._id)}>
                Mark as read
              </button>
            ) : (
              <span className="text-sm font-semibold text-emerald-600">Read</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
