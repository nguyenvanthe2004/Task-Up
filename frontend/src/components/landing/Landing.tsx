import {
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  Calendar,
  Bell,
  Shield,
  Star,
  ListTodo,
  Timer,
  Zap,
  TrendingUp,
  Target,
  CircleCheckBig,
  Sparkles,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Counter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(to / 80);
        const t = setInterval(() => {
          start += step;
          if (start >= to) { setCount(to); clearInterval(t); }
          else setCount(start);
        }, 16);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const TaskCard: React.FC<{
  title: string;
  tag: string;
  tagColor: string;
  progress: number;
  priority: "High" | "Medium" | "Low";
  avatarColors: string[];
}> = ({ title, tag, tagColor, progress, priority, avatarColors }) => {
  const pColor = {
    High: "text-rose-500 bg-rose-50 border-rose-200",
    Medium: "text-amber-500 bg-amber-50 border-amber-200",
    Low: "text-emerald-500 bg-emerald-50 border-emerald-200",
  }[priority];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-56">
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{ color: tagColor, background: `${tagColor}15`, borderColor: `${tagColor}40` }}
        >
          {tag}
        </span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${pColor}`}>{priority}</span>
      </div>
      <p className="text-[13px] font-semibold text-slate-800 mb-3 leading-snug">{title}</p>
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-slate-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex">
          {avatarColors.map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white text-[8px] font-bold text-white flex items-center justify-center"
              style={{ background: c, marginLeft: i > 0 ? -5 : 0 }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <CheckCircle2 size={13} className="text-slate-300" />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  iconBg: string;
  iconColor: string;
}> = ({ icon, title, desc, iconBg, iconColor }) => (
  <div className="group p-7 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/80 hover:-translate-y-1 transition-all duration-300 cursor-default">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

/* ─── Testimonial card ─── */
const TestimonialCard: React.FC<{
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}> = ({ quote, name, role, avatar, rating }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
    <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
        style={{ background: avatar }}
      >
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{name}</p>
        <p className="text-[11px] text-slate-400">{role}</p>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */
const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const inviteToken = params.get("inviteToken");

  useEffect(() => {
    if (!inviteToken) return;
    localStorage.setItem("inviteToken", inviteToken);
  }, [inviteToken]);

  return (
    <div className="bg-white font-sans antialiased overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-indigo-50 via-violet-50/50 to-transparent blur-3xl opacity-70" />
        <div className="pointer-events-none absolute top-20 left-[8%] w-72 h-72 rounded-full bg-indigo-100/40 blur-[80px]" />
        <div className="pointer-events-none absolute top-40 right-[6%] w-64 h-64 rounded-full bg-violet-100/40 blur-[80px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full mb-8 text-[11px] font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={11} />
            The smarter way to manage tasks
          </div>

          <h1 className="text-5xl md:text-[72px] font-black tracking-tight text-slate-900 leading-[1.02] mb-6 max-w-4xl mx-auto">
            Organize your work.{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Crush your goals.
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-60" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            TaskUp helps teams manage tasks, track progress, and hit their goals faster — all in one beautifully simple platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14">
            <button
              onClick={() => navigate("/register")}
              className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              Start for free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="group bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl font-bold text-[15px] hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              View demo
              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                <ArrowRight size={10} className="text-white" />
              </div>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium mb-20">
            {["Free forever", "No credit card required", "Set up in 2 minutes"].map((text) => (
              <div key={text} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(99,102,241,0.12)] overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-slate-200 rounded-lg px-8 py-1 text-[11px] text-slate-400 font-medium">
                    app.taskup.io/dashboard
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 min-h-[320px] grid grid-cols-12 gap-3">
                <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-3 space-y-1.5">
                  <div className="h-7 bg-indigo-600 rounded-lg" />
                  {["bg-slate-100","bg-slate-100","bg-indigo-50","bg-slate-100","bg-slate-100"].map((c, i) => (
                    <div key={i} className={`h-6 ${c} rounded-lg`} />
                  ))}
                </div>
                <div className="col-span-7 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total Tasks", value: "128", color: "text-indigo-600", bg: "bg-indigo-50" },
                      { label: "In Progress", value: "34", color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Completed", value: "89", color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map(({ label, value, color, bg }) => (
                      <div key={label} className={`${bg} rounded-xl p-3 border border-white`}>
                        <p className="text-[10px] text-slate-500 mb-1">{label}</p>
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                    {[80, 55, 90, 40].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-3 bg-slate-100 rounded flex-1" />
                        <div className="h-3 rounded" style={{ width: `${w}%`, background: ["#6366f140","#f472b640","#34d39940","#fb923c40"][i] }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-3 space-y-3">
                  <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-indigo-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div className="h-full w-3/4 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-1.5">
                    {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-slate-100 rounded" />)}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-1.5">
                    {[1, 2].map((i) => <div key={i} className="h-3 bg-slate-100 rounded" />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating task cards */}
            <div className="absolute -left-14 top-1/4 hidden lg:block drop-shadow-2xl">
              <TaskCard
                title="Redesign landing page UI"
                tag="Design"
                tagColor="#6366f1"
                progress={72}
                priority="High"
                avatarColors={["#6366f1", "#22d3ee"]}
              />
            </div>
            <div className="absolute -right-12 top-1/3 hidden lg:block drop-shadow-2xl">
              <TaskCard
                title="Write API documentation"
                tag="Dev"
                tagColor="#10b981"
                progress={45}
                priority="Medium"
                avatarColors={["#f472b6", "#fb923c", "#6366f1"]}
              />
            </div>

            {/* Floating notification */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-xl whitespace-nowrap">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Task completed! 🎉</p>
                <p className="text-[10px] text-slate-400">Update landing page design — just now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8">
            Trusted by 50,000+ teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {["SAMSUNG", "Booking.com", "IBM", "Shopify", "Netflix"].map((brand) => (
              <span key={brand} className="text-xl font-black tracking-tighter text-slate-300 hover:text-slate-500 transition-colors duration-300 cursor-default select-none">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
            <Zap size={10} /> Features
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              work smarter
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            From personal to-dos to large team projects — TaskUp handles it all with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <ListTodo size={22} />,
              title: "Task Management",
              desc: "Create, assign, and track tasks with Kanban boards, lists, and intuitive calendars. Prioritize work intelligently.",
              iconBg: "bg-indigo-50",
              iconColor: "text-indigo-600",
            },
            {
              icon: <Users size={22} />,
              title: "Team Collaboration",
              desc: "Work together in real time. Comment, mention, share files, and update progress — all within tasks.",
              iconBg: "bg-violet-50",
              iconColor: "text-violet-600",
            },
            {
              icon: <BarChart3 size={22} />,
              title: "Reports & Analytics",
              desc: "Visual dashboards help you understand team productivity. Track progress, time, and identify bottlenecks fast.",
              iconBg: "bg-sky-50",
              iconColor: "text-sky-600",
            },
            {
              icon: <Bell size={22} />,
              title: "Smart Notifications",
              desc: "Get timely alerts on deadlines, task updates, and team activity. Never miss anything important again.",
              iconBg: "bg-amber-50",
              iconColor: "text-amber-600",
            },
            {
              icon: <Calendar size={22} />,
              title: "Calendar & Timeline",
              desc: "View all your work on a calendar or Gantt chart. Plan sprints and manage deadlines with ease.",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
            },
            {
              icon: <Shield size={22} />,
              title: "Enterprise Security",
              desc: "Your data is end-to-end encrypted. Control access permissions for every member and project in detail.",
              iconBg: "bg-rose-50",
              iconColor: "text-rose-600",
            },
          ].map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <Timer size={10} /> How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                3 simple steps
              </span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
              No complex onboarding. No steep learning curve. Just results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-[34%] right-[34%] h-px bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200" />
            {[
              {
                step: "01",
                icon: <Target size={24} />,
                title: "Create a workspace",
                desc: "Set up a workspace for your team. Invite members and configure access permissions in seconds.",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                border: "border-indigo-100",
              },
              {
                step: "02",
                icon: <ListTodo size={24} />,
                title: "Add your tasks",
                desc: "Create tasks, assign them to teammates, set deadlines, and add tags to organize everything clearly.",
                color: "text-violet-600",
                bg: "bg-violet-50",
                border: "border-violet-100",
              },
              {
                step: "03",
                icon: <TrendingUp size={24} />,
                title: "Track & deliver",
                desc: "Update progress, view real-time reports, and celebrate when your team smashes their goals.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
              },
            ].map(({ step, icon, title, desc, color, bg, border }) => (
              <div key={step} className="relative flex flex-col items-center text-center group">
                <div className={`relative z-10 w-20 h-20 ${bg} border-2 ${border} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={color}>{icon}</span>
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: 50000, suffix: "+", label: "Active users", color: "text-indigo-600" },
            { value: 99, suffix: ".9%", label: "Guaranteed uptime", color: "text-emerald-600" },
            { value: 2000000, suffix: "+", label: "Tasks created", color: "text-violet-600" },
            { value: 140, suffix: "+", label: "App integrations", color: "text-amber-600" },
          ].map(({ value, suffix, label, color }) => (
            <div key={label} className="group cursor-default">
              <p className={`text-3xl md:text-4xl font-black mb-1 group-hover:scale-105 transition-transform duration-300 ${color}`}>
                <Counter to={value} suffix={suffix} />
              </p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-slate-50 border-t border-slate-100 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <Star size={10} className="fill-amber-500" /> Reviews
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Loved by teams everywhere
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
              Don't take our word for it — here's what our users have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "TaskUp completely changed how our team operates. Productivity jumped noticeably within just two weeks of using it.",
                name: "Sarah Johnson",
                role: "CTO at Acme Corp",
                avatar: "#6366f1",
                rating: 5,
              },
              {
                quote: "Beautiful UI, super easy to use, and packed with features. This is the best task management tool I've ever tried.",
                name: "Michael Chen",
                role: "Product Manager at Stripe",
                avatar: "#f472b6",
                rating: 5,
              },
              {
                quote: "We tried many tools before, but TaskUp is the only one that fits seamlessly into our entire team's workflow.",
                name: "Emily Rodriguez",
                role: "Founder & CEO at LaunchPad",
                avatar: "#10b981",
                rating: 5,
              },
            ].map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
              <Zap size={10} /> Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 text-lg font-medium">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Free</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-slate-900">$0</span>
                  <span className="text-slate-400 mb-1.5 font-medium">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Perfect for individuals and small teams</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Up to 5 members", "Unlimited tasks", "3 workspaces", "Basic reporting", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                Get started free
              </button>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 shadow-xl shadow-indigo-500/25 hover:-translate-y-0.5 transition-transform duration-300">
              <div className="absolute top-6 right-6">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Most popular
                </span>
              </div>
              <div className="mb-6">
                <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2">Pro</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-white">$12</span>
                  <span className="text-indigo-200 mb-1.5 font-medium">/month per user</span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">For growing teams that need more power</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited members","Unlimited workspaces","Gantt chart & Timeline","Advanced analytics","API access","Priority 24/7 support"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white">
                    <CheckCircle2 size={15} className="text-indigo-200 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-3 bg-white rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 shadow-md"
              >
                Try free for 14 days
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-slate-900 rounded-3xl px-10 py-20 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-10 right-1/4 w-72 h-72 rounded-full bg-violet-600/20 blur-[80px]" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-indigo-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
                <Sparkles size={10} /> Get started today
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
                Save one day every week.
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                Join thousands of teams already using TaskUp to get more done in less time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-indigo-900/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  Start for free
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300">
                  Talk to sales
                </button>
              </div>
              <p className="text-slate-600 text-xs mt-6 font-medium">
                Free forever · No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;