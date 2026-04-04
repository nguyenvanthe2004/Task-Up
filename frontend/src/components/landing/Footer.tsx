import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <span
              className="material-symbols-outlined text-primary text-2xl font-bold"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              <img src="/favicon.svg" alt="logo" className="w-7 h-7" />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              TaskUp
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
            The all-in-one productivity platform where teams come together to
            plan, organize, and collaborate on work.
          </p>
          <div className="flex gap-4 mt-8">
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">public</span>
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">group</span>
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-900">
            Product
          </h5>
          <ul className="space-y-4 text-on-surface-variant text-sm">
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Tasks
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Docs
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Goals
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Whiteboards
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-900">
            Support
          </h5>
          <ul className="space-y-4 text-on-surface-variant text-sm">
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                API Docs
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Status
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-6 text-xs uppercase tracking-widest text-slate-900">
            Company
          </h5>
          <ul className="space-y-4 text-on-surface-variant text-sm">
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Careers
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Privacy
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-outline flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
        <p>© 2024 Velocity Systems Inc.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary" href="#">
            Twitter
          </a>
          <a className="hover:text-primary" href="#">
            LinkedIn
          </a>
          <a className="hover:text-primary" href="#">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
