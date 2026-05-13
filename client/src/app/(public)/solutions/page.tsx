'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp, Users, Wallet, Zap, CheckCircle, Bookmark, ArrowRight, Network, MapPin } from 'lucide-react';

const similarJobs = [
  {
    id: '1',
    title: 'Lead ML Engineer',
    company: 'NEXUS AI',
    location: 'London / Remote',
    salary: '$220k – $280k',
    badge: 'NEW',
    badgeType: 'default',
  },
  {
    id: '2',
    title: 'Principal Product Designer',
    company: 'AETHER SYSTEMS',
    location: 'SF',
    salary: '$200k – $260k',
    badge: 'URGENT',
    badgeType: 'destructive',
  },
  {
    id: '3',
    title: 'AI Infrastructure Lead',
    company: 'QUANTUM DATA',
    location: 'NY / Remote',
    salary: '$250k – $350k',
    badge: 'ACTIVE',
    badgeType: 'secondary',
  },
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Cinematic Hero Header */}
      <Section className="relative overflow-hidden border-b border-outline-variant/5" padding="lg">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8">
          <Link href="/jobs" className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary transition-colors">
            Open Roles
          </Link>
          <ChevronRight size={14} className="text-outline" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Senior AI Architect</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20">
                <Network size={24} className="text-primary" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Aether Systems — Designing Tomorrow</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 text-glow">
              Senior AI <br />
              <span className="text-primary">Architect</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl">
              Join the Core Intelligence Unit to lead the architectural evolution of Aether's foundational neural operating system. Impact millions at scale.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Button className="px-12 py-4 text-sm font-bold rounded-xl hover:shadow-[0_0_40px_rgba(255,179,174,0.3)] transition-all duration-300 active:scale-[0.98]">
              APPLY FOR THIS ROLE
            </Button>
            <div className="flex items-center justify-center gap-4 text-on-surface-variant/60 text-xs font-medium">
              <span>Post date: Oct 24, 2024</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span>Ref ID: AE-992-ARC</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Salary Spotlight & Metadata */}
      <Section background="accent" padding="default">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">COMPENSATION</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-on-surface">$240k – $320k</span>
              <span className="text-sm text-on-surface-variant/60">/yr</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">LOCATION</span>
            <div className="flex items-center gap-2 text-xl font-bold text-on-surface">
              <MapPin size={20} className="text-primary" />
              San Francisco / Remote
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">EQUITY</span>
            <div className="flex items-center gap-2 text-xl font-bold text-on-surface">
              <Wallet size={20} className="text-primary" />
              0.15% – 0.25%
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">WORK MODEL</span>
            <div className="flex items-center gap-2 text-xl font-bold text-on-surface">
              <Zap size={20} className="text-primary" />
              High-Velocity
            </div>
          </div>
        </div>
      </Section>

      {/* Main Content Area */}
      <Section padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* AI Match Card (Mobile/Tablet prioritized) */}
            <div className="lg:hidden glass-card rounded-2xl p-8 cinematic-glow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">AI Compatibility</h3>
                <span className="px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase">98% Match</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-surface-container rounded-xl">
                  <div className="text-primary font-bold text-2xl mb-1">99%</div>
                  <div className="text-sm text-on-surface-variant/60">Neural Networks</div>
                </div>
                <div className="p-4 bg-surface-container rounded-xl">
                  <div className="text-primary font-bold text-2xl mb-1">95%</div>
                  <div className="text-sm text-on-surface-variant/60">System Design</div>
                </div>
                <div className="p-4 bg-surface-container rounded-xl">
                  <div className="text-primary font-bold text-2xl mb-1">92%</div>
                  <div className="text-sm text-on-surface-variant/60">Scalability</div>
                </div>
              </div>
            </div>

            <article>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">The Mission</h2>
              <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                Aether Systems is pioneering the next generation of foundational models. As a Senior AI Architect, you will sit at the nexus of research and engineering, translating cutting-edge breakthroughs into production-grade systems that power Global 500 enterprises.
              </p>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                You will own the infrastructure that scales our multimodal reasoning engine, ensuring sub-millisecond latency while maintaining the highest levels of factual integrity and security.
              </p>
            </article>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Core Responsibilities</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <CheckCircle size={24} className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-on-surface">Architectural Strategy</h4>
                    <p className="text-on-surface-variant/80">Lead the design of distributed systems for training and deploying large-scale neural networks across multi-cloud environments.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle size={24} className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-on-surface">Inference Optimization</h4>
                    <p className="text-on-surface-variant/80">Develop proprietary quantization and pruning techniques to reduce inference costs by 40% while preserving benchmark performance.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle size={24} className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-on-surface">Data Pipelines</h4>
                    <p className="text-on-surface-variant/80">Engineer petabyte-scale data ingestion and synthesis pipelines that feed our next-gen multimodal trainers.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle size={24} className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-on-surface">Mentorship</h4>
                    <p className="text-on-surface-variant/80">Guide a team of 15+ ML engineers, fostering a culture of technical excellence and rigorous scientific inquiry.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Cards */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Match Score Desktop */}
            <div className="hidden lg:block glass-card rounded-2xl p-8 cinematic-glow">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">Smart Analysis</span>
                  <h3 className="text-xl font-bold">Compatibility</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-primary">98%</span>
                  <span className="text-sm text-primary/60">Match Score</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Neural Networks</span>
                    <span>Expert</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[99%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>System Design</span>
                    <span>Strong</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[95%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Scalability</span>
                    <span>Expert</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[92%]"></div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8 py-3 border border-outline-variant/30 rounded-xl font-bold hover:bg-surface-container-highest transition-colors">
                VIEW SKILLS REPORT
              </Button>
            </div>

            {/* Company Insights */}
            <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10">
              <div className="relative h-48">
                <img 
                  alt="Company office interior" 
                  className="w-full h-full object-cover grayscale brightness-50"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAosbw0fj7iZzxEqtUMfD4QFgcvfaNtQsVfqRspz6MzxauiyZKw42l8swCVklbShruAsHyLS2zeMUSlJ-hXBowtsAqiOkffqbvKpvdH54P7G1ZiKpM3YCsF_NVEC3CuQNV7bU9hSujMLjGeBq_7HX4GkMMya3D2wOEuc_rPDWzPmjhb8RzAgjFT9cjU2Vaa1a6UWehOClvI7InfsT5zIEtw7Jw44gVi3q_OUfBCfnGsZIfD-CTo_SvTt22wFyN-egB67ngp7bA211ea"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-2">
                    <Network size={32} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xl leading-tight">Aether Systems</span>
                    <span className="text-white/60 text-sm">Series C • $2.4B Val.</span>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-on-surface-variant/40 uppercase">Team Size</span>
                    <span className="text-xl font-bold">340+</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-on-surface-variant/40 uppercase">Tech Stack</span>
                    <span className="text-xl font-bold">Rust/C++</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-on-surface-variant">Recent Growth</h4>
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-tertiary" />
                    <span className="text-on-surface-variant">Tripled revenue YoY in Enterprise Sector</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-tertiary" />
                    <span className="text-on-surface-variant">Founded by OpenAI/DeepMind veterans</span>
                  </div>
                </div>
                <Button className="w-full py-4 rounded-xl font-bold hover:shadow-lg transition-all group">
                  SMART APPLY
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* Similar Opportunities */}
      <Section background="accent" padding="lg">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Similar Opportunities</h2>
          <Link href="/jobs" className="text-xs font-bold uppercase text-primary hover:underline underline-offset-8">
            EXPLORE ALL ROLES
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarJobs.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-8 hover:bg-surface-container transition-colors group cursor-pointer border-t-2 border-t-transparent hover:border-t-primary/40"
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  job.badgeType === 'destructive' 
                    ? 'bg-destructive/10 text-destructive' 
                    : job.badgeType === 'secondary'
                    ? 'bg-secondary/10 text-secondary'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {job.badge}
                </span>
                <Bookmark size={20} className="text-on-surface-variant/40 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2">{job.title}</h3>
              <p className="text-sm text-on-surface-variant/60 mb-8">{job.company} • {job.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-on-surface font-medium">{job.salary}</span>
                <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </main>
  );
}