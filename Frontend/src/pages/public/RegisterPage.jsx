import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentee",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const user = await register(form);
      navigate(`/${user.role}`);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-app py-20">
      <form onSubmit={handleSubmit} className="card mx-auto max-w-2xl space-y-5 p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">Create Account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Join as mentor or mentee</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            options={[
              { value: "mentee", label: "Mentee" },
              { value: "mentor", label: "Mentor" },
            ]}
          />
        </div>
        <Button className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
        <p className="text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-primary-600">Login</Link>
        </p>
      </form>
    </section>
  );
}
