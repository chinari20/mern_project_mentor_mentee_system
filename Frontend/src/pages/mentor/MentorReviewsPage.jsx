import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../hooks/useAuth";
import { dataService } from "../../services/dataService";

export default function MentorReviewsPage() {
  const { user } = useAuth();
  const { data, loading } = useFetch(() => dataService.getReviews({ mentorId: user?._id }), [user?._id]);

  if (loading) return <Loader />;

  return (
    <div>
      <SectionHeading title="Reviews" description="Read what mentees are saying after completed sessions." />
      <div className="space-y-4">
        {(data || []).map((review) => (
          <div key={review._id} className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-950">{review.menteeId?.name}</h3>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                {review.rating}/5
              </span>
            </div>
            <p className="mt-3 text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
