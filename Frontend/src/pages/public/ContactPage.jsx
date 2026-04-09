import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { SectionHeading } from "../../components/common/SectionHeading";
import { Textarea } from "../../components/common/Textarea";

export default function ContactPage() {
  return (
    <section className="container-app py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Talk to the platform team"
            description="Use this page for demo inquiries, campus projects, or internal showcase walkthroughs."
          />
          <div className="card p-6">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">support@mentorapp.com</p>
            <p className="mt-5 text-sm text-slate-500">Location</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">India, remote-first team</p>
          </div>
        </div>
        <form className="card space-y-5 p-8">
          <Input label="Full Name" placeholder="Enter your name" />
          <Input label="Email" placeholder="Enter your email" />
          <Input label="Subject" placeholder="What is this about?" />
          <Textarea label="Message" placeholder="Tell us what you need" />
          <Button type="button">Send Message</Button>
        </form>
      </div>
    </section>
  );
}
