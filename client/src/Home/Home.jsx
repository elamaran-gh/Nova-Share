import { Link } from "react-router-dom";
import { IoMdCloudUpload } from "react-icons/io";
import { SiFsecure, SiReact, SiRedux, SiTailwindcss, SiNodedotjs, SiMongodb } from "react-icons/si";
import { FaLock, FaClock, FaQrcode, FaEnvelope, FaUserCheck, FaLink, FaShareAlt } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";

const Home = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100">

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-10 py-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          <span className="text-white font-bold text-lg tracking-tight">NovaShare</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="#how" className="text-sm text-slate-400 hover:text-white transition">How it works</a>
          <a href="#tech" className="text-sm text-slate-400 hover:text-white transition">Tech stack</a>
          <Link to="/login">
            <button className="text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition">
              Sign in
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#0d1b3e 40%,#0a2240 70%,#061428 100%)" }}>

        {/* Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[90px]"
          style={{ background: "#3b82f6", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full opacity-15 blur-[90px]"
          style={{ background: "#8b5cf6", transform: "translate(-30%,30%)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Badge */}
        <div className="relative z-10 flex items-center gap-2 bg-blue-500/15 border border-blue-500/35 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs text-blue-300 tracking-widest uppercase font-medium">Secure · Fast · JWT Authenticated</span>
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold text-white text-center leading-tight tracking-tight max-w-3xl mb-5">
          Share files with{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            zero friction.
          </span>
        </h1>

        <p className="relative z-10 text-slate-400 text-center max-w-xl text-lg leading-relaxed mb-9">
          Upload any file, generate a short shareable link, password-protect it, set an expiry — all in seconds. Built for professionals.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex gap-3 flex-wrap justify-center mb-12">
          <Link to="/signup">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3.5 rounded-xl font-medium text-sm transition hover:-translate-y-0.5">
              ↑ &nbsp;Start uploading
            </button>
          </Link>
          <a href="#how">
            <button className="bg-white/8 hover:bg-white/15 text-slate-200 border border-white/15 px-7 py-3.5 rounded-xl font-medium text-sm transition">
              ▶ &nbsp;See how it works
            </button>
          </a>
        </div>

        {/* Upload demo card */}
        <div className="relative z-10 bg-white/4 border border-white/10 rounded-2xl px-8 py-6 flex flex-col items-center gap-4 w-full max-w-sm mb-12">
          <div className="flex items-center gap-3 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center text-indigo-300 text-sm">
              <TbUpload />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-200 font-medium">project-report.pdf</p>
              <p className="text-xs text-slate-500">4.2 MB</p>
            </div>
            <span className="text-emerald-400 text-base">✓</span>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Uploading to Cloudinary...</span><span>72%</span>
            </div>
            <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
              <div className="h-full w-[72%] rounded-full" style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)" }} />
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">
            <span className="text-slate-200 font-medium">nova.share/f/xK9mP2</span><br />
            Link copied · Expires in 10 days
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10 flex-wrap justify-center">
          {[["JWT", "Auth secured"], ["QR", "Instant sharing"], ["5TB", "File support"], ["100%", "Cloud backed"]].map(([num, label], i, arr) => (
            <div key={label} className="flex items-center gap-10">
              <div className="text-center">
                <p className="text-white font-bold text-2xl tracking-tight">{num}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-950 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium tracking-widest uppercase text-blue-500 mb-3">Everything you need</p>
          <h2 className="text-4xl font-bold tracking-tight mb-3">Built for real workflows</h2>
          <p className="text-gray-500 max-w-xl leading-relaxed mb-12">
            From one-click uploads to email delivery and QR codes — NovaShare handles every step of your file-sharing pipeline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <IoMdCloudUpload size={22} />, color: "text-blue-600 bg-blue-50", title: "Instant uploads", desc: "Drag and drop any file. Stored securely on Cloudinary with a direct shareable URL generated immediately." },
              { icon: <FaLock size={18} />, color: "text-purple-600 bg-purple-50", title: "Password protection", desc: "Encrypt links with bcrypt-hashed passwords. Recipients must verify before accessing your file." },
              { icon: <FaClock size={18} />, color: "text-teal-600 bg-teal-50", title: "Expiry control", desc: "Set custom expiry times in hours. Files auto-expire and become inaccessible after the set time." },
              { icon: <FaQrcode size={18} />, color: "text-amber-600 bg-amber-50", title: "QR code sharing", desc: "Generate scannable QR codes for any file instantly. Perfect for presentations and in-person sharing." },
              { icon: <FaEnvelope size={18} />, color: "text-pink-600 bg-pink-50", title: "Email delivery", desc: "Send file links directly to any email address from within the app with branded templates." },
              { icon: <FaUserCheck size={18} />, color: "text-green-600 bg-green-50", title: "JWT authentication", desc: "Every route is protected. Bearer token auth with user-scoped file access — only you see your uploads." },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-gray-200 hover:-translate-y-1 transition">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${color} dark:bg-opacity-20`}>{icon}</div>
                <h3 className="font-medium text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white dark:bg-gray-900 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-blue-500 mb-3">Simple process</p>
          <h2 className="text-4xl font-bold tracking-tight mb-12">Three steps to share anything</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Sign in securely", desc: "Register and authenticate with JWT. Your session is token-protected — no anonymous access." },
              { n: "2", title: "Upload your file", desc: "Drop any file into the uploader. It streams to Cloudinary and a short link is generated instantly." },
              { n: "3", title: "Share everywhere", desc: "Copy the link, share via QR code, send by email, or post to WhatsApp — your choice." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center p-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>{n}</div>
                <h3 className="font-medium text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section id="tech" className="bg-gray-50 dark:bg-gray-950 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-blue-500 mb-3">Tech stack</p>
          <h2 className="text-4xl font-bold tracking-tight mb-10">Built with modern tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: <SiReact size={24} className="text-cyan-400" />, label: "React 18" },
              { icon: <SiRedux size={24} className="text-purple-400" />, label: "Redux Toolkit" },
              { icon: <SiNodedotjs size={24} className="text-green-500" />, label: "Node.js" },
              { icon: <SiMongodb size={24} className="text-emerald-500" />, label: "MongoDB" },
              { icon: <SiTailwindcss size={24} className="text-sky-400" />, label: "Tailwind" },
              { icon: <FaLock size={20} className="text-orange-400" />, label: "JWT Auth" },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl py-4 px-3 flex flex-col items-center gap-2 text-xs font-medium text-gray-500">
                {icon}{label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#0d1b3e 60%,#0a2240 100%)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{ background: "#3b82f6" }} />
        <h2 className="relative text-4xl font-bold text-white tracking-tight mb-3">Ready to share smarter?</h2>
        <p className="relative text-slate-400 mb-8">Join NovaShare — secure file sharing for professionals.</p>
        <div className="relative flex gap-3 justify-center flex-wrap">
          <Link to="/signup">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3.5 rounded-xl font-medium text-sm transition">
              Create free account
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-white/8 hover:bg-white/15 text-slate-200 border border-white/15 px-7 py-3.5 rounded-xl font-medium text-sm transition">
              Sign in
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8 text-center px-4">
        <p className="font-bold text-base mb-1">NovaShare</p>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NovaShare. Built with MERN + Cloudinary.</p>
        <div className="flex justify-center gap-8 mt-4">
          <a href="#" className="text-sm text-gray-400 hover:text-gray-700">Privacy</a>
          <a href="#" className="text-sm text-gray-400 hover:text-gray-700">Terms</a>
          <a href="https://github.com/elamaran-gh/Nova-Share" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-gray-700">GitHub</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;
