import { ArrowRight, Calendar, MessageCircle, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../../components/common/SectionHeading";
import { dataService } from "../../services/dataService";
import { useFetch } from "../../hooks/useFetch";
import { MentorCard } from "../../components/mentor/MentorCard";
import { Loader } from "../../components/common/Loader";

const features = [
  { title: "Mentor Discovery", description: "Search by expertise, rating, experience, and pricing.", icon: Users },
  { title: "Session Booking", description: "Schedule mentorship sessions with structured details and status tracking.", icon: Calendar },
  { title: "Direct Chat", description: "One-to-one messaging for active mentor-mentee relationships.", icon: MessageCircle },
  { title: "Goal Tracking", description: "Track learning milestones with mentor feedback and progress updates.", icon: Target },
];

export default function LandingPage() {
  const { data: mentors, loading } = useFetch(() => dataService.getMentors({ sortBy: "rating" }), []);

  return (
    <div>
      <section className="container-app py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700">
              Startup-grade mentoring platform
            </p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-slate-950 md:text-6xl">
              Find the right mentor, build momentum, and turn goals into outcomes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              A complete mentor-mentee ecosystem for discovery, mentorship requests, scheduling,
              real-time messaging, progress tracking, and role-based management.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                Start as Mentee <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link to="/mentors" className="btn-secondary">
                Explore Mentors
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden bg-slate-950 p-8 text-white">
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-3xl bg-white/10 p-5">
                    <Icon className="text-accent" />
                    <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-10">
        <SectionHeading
          eyebrow="Top Mentors"
          title="Curated mentors across product, data, and career growth"
          description="Browse proven mentors with strong ratings, polished profiles, and structured availability."
        />
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(mentors || []).slice(0, 3).map((mentor) => (
              <MentorCard key={mentor._id} mentor={mentor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
