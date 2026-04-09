import { Link } from "react-router-dom";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/formatters";

export function MentorCard({ mentor }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-600">
            {mentor.category?.name || "General"}
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{mentor.user?.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{mentor.headline || mentor.bio}</p>
        </div>
        <Badge variant="warning">{mentor.ratingAverage || 0} stars</Badge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {mentor.expertise?.slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{mentor.experience} years experience</p>
          <p className="text-base font-semibold text-slate-950">{formatCurrency(mentor.fee)}</p>
        </div>
        <Link to={`/mentors/${mentor.user?._id}`}>
          <Button>View Profile</Button>
        </Link>
      </div>
    </div>
  );
}
