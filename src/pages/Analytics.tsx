import { useEffect, useState } from 'react';
import {
  Briefcase,
  Calendar,
  ArrowUpCircle,
  XCircle,
  Building2,
  Bookmark,
  Plus,
} from 'lucide-react';
import { analyticsAPI, AnalyticsSummary } from '@/services/analyticsAPI';

// New StatCard component - Ultra-luxury navy + white style
const StatCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: number | string;
}> = ({ icon, title, value }) => {
  const Icon = icon;
  return (
    <div className="bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 p-6 rounded-2xl border border-white/[0.15] group backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">{title}</p>
        <Icon className="h-5 w-5 text-white/60" />
      </div>
      <p className="text-6xl font-bold text-white tracking-tight">{value}</p>
      <div className="mt-3 text-xs text-white/50 font-medium">+0% from last week</div>
    </div>
  );
};

const KanbanCard: React.FC<{ company: string; role: string; tag?: string }> = ({ company, role, tag }) => (
    <div className="bg-white/[0.04] hover:bg-white/[0.08] hover:translate-y-[-2px] transition-all duration-300 p-4 rounded-xl border border-white/[0.15] mb-3 cursor-pointer group">
        <h4 className="font-semibold text-white text-sm mb-1.5">{company}</h4>
        <p className="text-xs text-white/60 mb-2">{role}</p>
        {tag && <span className="inline-block px-2.5 py-1 text-xs rounded-md bg-white/[0.08] text-white/80 border border-white/[0.2] font-medium">{tag}</span>}
    </div>
)

export default function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [summaryData] = await Promise.all([
          analyticsAPI.getSummary(),
        ]);
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-dark-charcoal min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-subtle-purple"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#001233] via-[#001a4d] to-[#0a2540] text-white min-h-screen p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <main className="col-span-12 xl:col-span-9 space-y-8">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Analytics Dashboard</h1>
              <p className="text-sm text-white/60 font-medium">Track your application performance and insights</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <StatCard
                icon={Briefcase}
                title="Total Applications"
                value={summary?.totals.applications || 4}
              />
              <StatCard
                icon={Calendar}
                title="Interviews Scheduled"
                value={summary?.totals.interviews || 3}
              />
              <StatCard
                icon={ArrowUpCircle}
                title="Offers Received"
                value={summary?.totals.offers || 0}
              />
              <StatCard
                icon={XCircle}
                title="Rejections"
                value={summary?.totals.rejections || 0}
              />
              <StatCard
                icon={Building2}
                title="Active Companies"
                value={summary?.totals.opportunities || 4}
              />
              <StatCard
                icon={Bookmark}
                title="Saved Jobs"
                value={0}
              />
            </div>

            {/* Application Status Board */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-white">Application Status Board</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Applied Column */}
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.12]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Applied</h3>
                    <span className="bg-white/[0.15] text-[11px] font-bold px-2.5 py-1 rounded-lg text-white">1</span>
                  </div>
                  <KanbanCard company="Amazon" role="Software Development Engineer" tag="SDE" />
                </div>
                {/* Assessment Column */}
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.12]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Assessment</h3>
                    <span className="bg-white/[0.15] text-[11px] font-bold px-2.5 py-1 rounded-lg text-white">1</span>
                  </div>
                  <KanbanCard company="Microsoft" role="SDE Intern" tag="Internship" />
                </div>
                {/* Interview Column */}
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.12]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interview</h3>
                    <span className="bg-white/[0.15] text-[11px] font-bold px-2.5 py-1 rounded-lg text-white">1</span>
                  </div>
                  <KanbanCard company="Google" role="Software Engineer" tag="L3" />
                </div>
                {/* Offer Column */}
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.12]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Offer</h3>
                    <span className="bg-white/[0.15] text-[11px] font-bold px-2.5 py-1 rounded-lg text-white">0</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar for Quick Actions */}
          <aside className="col-span-12 xl:col-span-3 space-y-5">
            <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.12] backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-widest">Quick Actions</h3>
              <button className="w-full bg-white hover:bg-white/90 active:bg-white/80 text-[#001233] font-bold py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center text-sm shadow-lg shadow-white/10 hover:shadow-white/20">
                <Plus className="mr-2 h-5 w-5" /> Add Application
              </button>
              <button className="w-full mt-3 bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold py-3.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center text-sm border border-white/[0.2]">
                <Plus className="mr-2 h-5 w-5" /> Add Company
              </button>
            </div>
          </aside>
        </div>
        <footer className="text-center text-white/40 mt-16 text-xs font-medium">
          © 2026 Smart Placement
        </footer>
      </div>
    </div>
  );
}
