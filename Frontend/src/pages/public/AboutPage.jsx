import { SectionHeading } from "../../components/common/SectionHeading";

export default function AboutPage() {
  return (
    <section className="container-app py-20">
      <SectionHeading
        eyebrow="About"
        title="A focused platform for guided growth"
        description="Mentor-Mentee System is designed for students and professionals who need a clean workflow for finding mentors, organizing sessions, and measuring learning progress."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          ["For Mentees", "Discover mentors, request guidance, book sessions, and track goals in one place."],
          ["For Mentors", "Manage requests, active mentees, session schedules, reviews, and progress updates."],
          ["For Admins", "Monitor platform health, manage users, moderate profiles, and organize categories."],
        ].map(([title, copy]) => (
          <div key={title} className="card p-6">
            <h3 className="text-xl font-bold text-slate-950">{title}</h3>
            <p className="mt-3 text-slate-600">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
