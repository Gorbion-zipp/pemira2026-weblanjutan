import { Head, router } from '@inertiajs/react';
import { Vote, Users, CheckCircle2, Clock, ArrowLeft, RefreshCw, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ThemeToggle } from '@/components/theme-toggle';

interface ChartCandidate {
    id: number;
    candidate_number: string;
    name: string;
    votes: number;
}

interface Stats {
    total_dpt: number;
    total_voted: number;
    total_unvoted: number;
    percentage: number;
}

interface LiveCountProps {
    stats: Stats;
    chartData: ChartCandidate[];
}

const COLORS = ['#2563eb', '#4f46e5', '#0284c7', '#0d9488'];

export default function LiveCount({ stats, chartData }: LiveCountProps) {
    const handleRefresh = () => {
        router.reload({ only: ['stats', 'chartData'] });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white transition-colors duration-300 relative overflow-hidden">
            <Head title="Live Count - E-Voting Pilkades" />

            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />

            {/* Header / Navbar */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit('/')}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none flex items-center gap-2">
                            <span>Live Count Real-Time</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Perhitungan Suara Digital Pilkades</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300 hover:border-blue-500 transition backdrop-blur shadow-sm"
                    >
                        <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Perbarui Data</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 z-10 space-y-8">
                
                {/* Cards Summary Statistic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm dark:shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total DPT</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total_dpt}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm dark:shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Suara Masuk</p>
                            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.total_voted}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm dark:shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Belum Memilih</p>
                            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{stats.total_unvoted}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm dark:shadow-xl flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Partisipasi</p>
                            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{stats.percentage}%</h3>
                        </div>
                    </div>
                </div>

                {/* Main Visual Chart */}
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Perolehan Suara Pasangan Calon</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Grafik hasil perhitungan suara secara langsung</p>
                        </div>
                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-mono">
                            Auto-Sync
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <XAxis 
                                    dataKey="candidate_number" 
                                    tickFormatter={(val) => `Paslon ${val}`}
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                />
                                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#334155',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value: number) => [`${value} Suara`, 'Perolehan']}
                                    labelFormatter={(label) => `Paslon No. ${label}`}
                                />
                                <Bar dataKey="votes" radius={[12, 12, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Breakdown List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        {chartData.map((cand, idx) => (
                            <div key={cand.id} className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        {cand.candidate_number}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cand.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Pasangan Calon No. {cand.candidate_number}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{cand.votes}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">Suara</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400 z-10">
                &copy; {new Date().getFullYear()} Panitia Pemilihan Kepala Desa Digital (E-Voting). All rights reserved.
            </footer>
        </div>
    );
}