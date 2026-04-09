import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(form);
      navigate(`/${user.role}`);
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-app py-20">
      <form onSubmit={handleSubmit} className="card mx-auto max-w-xl space-y-5 p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-500">Welcome back</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Login to your account</h1>
        </div>
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <Button className="w-full" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </Button>
        <p className="text-sm text-slate-500">
          New here? <Link to="/register" className="font-semibold text-primary-600">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
