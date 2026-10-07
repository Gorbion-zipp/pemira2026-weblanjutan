import { Head, Link } from '@inertiajs/react';
import { Vote, ArrowRight, ShieldCheck, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden selection:bg-blue-500 selection:text-white">
            <Head title="Beranda - E-Voting Pilkades" />

            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />

            {/* Header / Navbar */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/20 dark:border-blue-500/30 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm">
                        <Vote className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                            E-Voting Pilkades
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sistem Pemilihan Kepala Desa Digital</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300 backdrop-blur shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Luber Jurdil & Terenkripsi</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-6">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Portal Resmi Pemilihan Kepala Desa Digital</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                    Gunakan Hak Pilih Anda <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Demi Masa Depan Desa
                    </span>
                </h1>

                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Sistem pemungutan suara berbasis digital yang aman, jujur, adil, dan terenkripsi secara otomatis. Masuk menggunakan identitas DPT Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
                    <Link
                        href="/login"
                        className="py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 group"
                    >
                        <span>Masuk ke Bilik Suara</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/live-count"
                        className="py-3.5 px-6 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>Lihat Live Count</span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400 z-10">
                &copy; {new Date().getFullYear()} Panitia Pemilihan Kepala Desa Digital (E-Voting). All rights reserved.
            </footer>
        </div>
    );
}