import toast from "react-hot-toast";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { SectionHeading } from "../../components/common/SectionHeading";
import { MentorCard } from "../../components/mentor/MentorCard";
import { dataService } from "../../services/dataService";
import { useFetch } from "../../hooks/useFetch";

export default function MenteeFavoritesPage() {
  const { data: profileData, loading: profileLoading, setData: setProfileData } = useFetch(
    () => dataService.getMyProfile(),
    [],
  );
  const { data: mentors, loading: mentorsLoading } = useFetch(() => dataService.getMentors(), []);

  if (profileLoading || mentorsLoading) return <Loader />;

  const favorites = profileData?.profile?.favorites || [];
  const favoriteIds = new Set(favorites.map((mentor) => mentor._id));
  const favoriteMentors = (mentors || []).filter((mentor) => favoriteIds.has(mentor.user?._id));

  const handleRemove = async (mentorId) => {
    try {
      await dataService.toggleFavorite(mentorId);
      setProfileData((current) => ({
        ...current,
        profile: {
          ...current.profile,
          favorites: current.profile.favorites.filter((mentor) => mentor._id !== mentorId),
        },
      }));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error(error.message || "Unable to update favorites");
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Favorite Mentors"
        description="Return to shortlisted mentors quickly and prune the list as your focus changes."
      />
      {favoriteMentors.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {favoriteMentors.map((mentor) => (
            <div key={mentor._id} className="space-y-3">
              <MentorCard mentor={mentor} />
              <button
                className="btn-secondary w-full"
                onClick={() => handleRemove(mentor.user?._id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved mentors"
          description="Browse mentors and save profiles you want to revisit later."
        />
      )}
      {favorites.length > 0 && favoriteMentors.length === 0 ? (
        <div className="card p-6 text-sm text-slate-500">
          Some saved mentors are no longer publicly listed, likely because their profile is pending approval or unavailable.
        </div>
      ) : null}
    </div>
  );
}
