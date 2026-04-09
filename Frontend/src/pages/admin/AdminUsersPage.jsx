import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EmptyState } from "../../components/common/EmptyState";
import { Loader } from "../../components/common/Loader";
import { Select } from "../../components/common/Select";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useFetch } from "../../hooks/useFetch";
import { dataService } from "../../services/dataService";

export default function AdminUsersPage() {
  const { data, loading, setData } = useFetch(() => dataService.adminUsers(), []);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");

  const handleToggle = async (id) => {
    try {
      const response = await dataService.toggleBlockUser(id);
      setData((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item)),
      );
    } catch (error) {
      toast.error(error.message || "Unable to update user");
    }
  };

  const filteredUsers = useMemo(
    () =>
      (data || []).filter((user) => {
        const matchesQuery =
          !query ||
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase());
        const matchesRole = !role || user.role === role;
        return matchesQuery && matchesRole;
      }),
    [data, query, role],
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <SectionHeading title="User Management" description="Block or unblock accounts as part of moderation." />
      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-3">
        <input
          className="input md:col-span-2"
          placeholder="Search by name or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          label="Role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          options={[
            { value: "", label: "All roles" },
            { value: "admin", label: "Admin" },
            { value: "mentor", label: "Mentor" },
            { value: "mentee", label: "Mentee" },
          ]}
        />
      </div>
      <div className="space-y-4">
        {filteredUsers.length ? (
          filteredUsers.map((user) => (
          <div key={user._id} className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">{user.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{user.email} | {user.role}</p>
            </div>
            <button className="btn-secondary" onClick={() => handleToggle(user._id)}>
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
          ))
        ) : (
          <EmptyState
            title="No users found"
            description="Try a different search term or role filter."
          />
        )}
      </div>
    </div>
  );
}
