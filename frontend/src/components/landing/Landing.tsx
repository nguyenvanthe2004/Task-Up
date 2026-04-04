import { ArrowRight, CircleCheck, CirclePlay } from "lucide-react";
import type React from "react";

const Landing: React.FC = () => {
  return (
    <div className="pt-14 font-sans antialiased">
      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 text-center overflow-hidden">
        {/* Decorative blurred blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="pointer-events-none absolute -top-16 -right-32 w-[400px] h-[400px] rounded-full bg-violet-200/30 blur-[100px]" />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600
                        px-4 py-1.5 rounded-full mb-8 text-[11px] font-bold uppercase tracking-widest
                        shadow-sm transition-all duration-300 hover:bg-indigo-100 hover:shadow-md hover:-translate-y-0.5 cursor-default"
        >
          <span className="material-symbols-outlined text-sm leading-none">
            auto_awesome
          </span>
          V3 is now live
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 max-w-4xl mx-auto leading-[1.05]">
          One platform to replace{" "}
          <span className="relative inline-block text-primary">
            them all.
            <span className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-70" />
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          All your work in one place: Tasks, Docs, Chat, Goals, &amp; more.
          Velocity is the productivity platform that actually works for you.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button
            className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white
                             px-9 py-4 rounded-xl font-bold text-base shadow-lg shadow-indigo-500/25
                             transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30
                             active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started for Free
              <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight />
              </span>
            </span>
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button
            className="group bg-white border border-slate-200 text-slate-800
                             px-9 py-4 rounded-xl font-bold text-base shadow-sm
                             hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5
                             transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">
              <CirclePlay />
            </span>
            Book a Demo
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-5xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white
                          shadow-[0_20px_80px_rgba(0,0,0,0.10)] transition-all duration-500 hover:shadow-[0_30px_100px_rgba(99,102,241,0.15)]"
          >
            <div className="bg-slate-100 flex items-center gap-1.5 px-4 py-3 border-b border-slate-200">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <img
              alt="Velocity Productivity Platform Dashboard"
              className="w-full object-cover"
              src="https://res.cloudinary.com/monday-blogs/fl_lossy,f_auto,q_auto/wp-blog/2020/12/WM_Boards_3-1-scaled.jpg"
            />
          </div>

          {/* Floating toast */}
          <div
            className="absolute -bottom-5 -right-4 hidden lg:flex items-center gap-3
                          bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-xl
                          animate-bounce-slow w-60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-emerald-500 text-sm">
                <CircleCheck />
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Task Completed</p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Update landing page design
              </p>
            </div>
          </div>

          {/* Second floating badge */}
          <div
            className="absolute -top-5 -left-4 hidden lg:flex items-center gap-2
                          bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-xl w-52"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-indigo-500 text-sm">
                bolt
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">2× faster</p>
              <p className="text-[10px] text-slate-400">
                than your current stack
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-10">
            Trusted by over 8,000,000 users worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
            {["SAMSUNG", "Booking.com", "IBM", "Logitech", "Netflix"].map(
              (brand) => (
                <span
                  key={brand}
                  className="text-xl font-black tracking-tighter text-slate-300
                           transition-all duration-300 hover:text-slate-600 cursor-default select-none"
                >
                  {brand}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            The all-in-one productivity tool
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Flexibility meets organization. Customize Velocity to work for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "view_kanban",
              color: "indigo",
              title: "Tasks & Projects",
              desc: "Manage projects of any size with lists, boards, gantt charts, and everything in between.",
            },
            {
              icon: "description",
              color: "violet",
              title: "Docs & Knowledge",
              desc: "Create beautiful docs, wikis, and roadmaps. Connect them to workflows and collaborate in real-time.",
            },
            {
              icon: "forum",
              color: "sky",
              title: "Team Chat",
              desc: "Communicate with your team in real-time. Share files, link tasks, and keep conversations in context.",
            },
          ].map(({ icon, color, title, desc }) => (
            <div
              key={title}
              className="group p-8 bg-white border border-slate-200 rounded-2xl
                         hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-2
                         transition-all duration-500 cursor-default"
            >
              <div
                className={`w-12 h-12 bg-${color}-50 border border-${color}-100 rounded-xl flex items-center justify-center mb-6
                              group-hover:scale-110 transition-transform duration-300`}
              >
                <span className={`material-symbols-outlined text-${color}-500`}>
                  {icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {desc}
              </p>
              <a
                className="inline-flex items-center gap-1 text-indigo-600 font-bold text-sm
                           group/link hover:gap-2 transition-all duration-200"
                href="#"
              >
                Learn more
                <span className="material-symbols-outlined text-sm transition-transform duration-200 group-hover/link:translate-x-1">
                  <ArrowRight />
                </span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "8M+", label: "Users worldwide" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "140+", label: "Integrations" },
            { value: "4.9★", label: "Average rating" },
          ].map(({ value, label }) => (
            <div key={label} className="group cursor-default">
              <p
                className="text-3xl md:text-4xl font-black text-slate-900 mb-1
                            transition-colors duration-300 group-hover:text-indigo-600"
              >
                {value}
              </p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative bg-slate-900 rounded-3xl px-12 py-20 text-center overflow-hidden">
          <div className="pointer-events-none absolute top-0 left-1/4 w-80 h-80 rounded-full bg-indigo-600/25 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-violet-500/20 blur-[100px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-4">
              Get started today
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Save one day every week.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Get the productivity platform that helps you get more done in less
              time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white
                                 px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-indigo-900/40
                                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Get Started for Free
                  <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight />
                  </span>
                </span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                className="bg-white/5 border border-white/10 text-white
                                 px-10 py-4 rounded-xl font-bold text-base
                                 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5
                                 transition-all duration-300 active:scale-95"
              >
                See pricing
              </button>
            </div>

            <p className="text-slate-600 text-xs mt-6">
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
