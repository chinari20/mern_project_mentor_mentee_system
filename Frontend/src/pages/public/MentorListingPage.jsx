import { useState } from "react";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { Select } from "../../components/common/Select";
import { SectionHeading } from "../../components/common/SectionHeading";
import { MentorCard } from "../../components/mentor/MentorCard";
import { dataService } from "../../services/dataService";
import { useFetch } from "../../hooks/useFetch";

export default function MentorListingPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState("");
  const [maxFee, setMaxFee] = useState("");

  const { data: mentors, loading } = useFetch(
    () =>
      dataService.getMentors({
        search: query,
        category,
        sortBy,
        minRating,
        maxFee,
      }),
    [query, category, sortBy, minRating, maxFee],
  );

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...Array.from(new Set((mentors || []).map((mentor) => mentor.category?.name).filter(Boolean))).map(
      (name) => ({ value: name, label: name }),
    ),
  ];

  return (
    <section className="container-app py-20">
      <SectionHeading
        eyebrow="Mentor Network"
        title="Browse high-signal mentors"
        description="Search by name or skill and explore profiles built for meaningful mentorship discovery."
      />
      <div className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-2 xl:grid-cols-5">
        <input
          className="input md:col-span-2 xl:col-span-2"
          placeholder="Search by mentor name or skill"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <Select
          label="Sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          options={[
            { value: "rating", label: "Top rated" },
            { value: "popular", label: "Most popular" },
            { value: "newest", label: "Newest" },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 xl:col-span-1">
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Min rating"
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Max fee"
            value={maxFee}
            onChange={(event) => setMaxFee(event.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : !(mentors || []).length ? (
        <EmptyState
          title="No mentors match these filters"
          description="Try broadening your search, category, rating, or fee filters."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(mentors || []).map((mentor) => (
            <MentorCard key={mentor._id} mentor={mentor} />
          ))}
        </div>
      )}
    </section>
  );
}
