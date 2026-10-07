import { Head, router } from '@inertiajs/react';
import { CheckCircle2, ShieldCheck, ArrowRight, BarChart3, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface SuccessProps {
    voterName?: string;
    referenceCode?: string;
}

export default function VoteSuccess({ voterName, referenceCode }: SuccessProps) {
    // Generate referensi acak jika tidak dikirim dari backend
    const refCode = referenceCode || `EVOTE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden selection:bg-blue-500 selection:text-white">
            <Head title="Suara Terkirim - E-Voting Pilkades" />

            {/* Background Glow Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />

            {/* Top Bar / Header */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600/10 dark:bg-emerald-600/20 border border-emerald-500/20 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                            E-Voting Pilkades
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Status Pencoblosan Berhasil</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300 backdrop-blur shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Terenkripsi & Sah</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 flex flex-col justify-center items-center text-center z-10">
                <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-xl dark:shadow-2xl w-full relative transition-colors duration-300">
                    
                    {/* Circle Icon Checkmark Animasi */}
                    <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                        <CheckCircle2 className="h-10 w-10 animate-pulse" />
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                        Terima Kasih Atas Partisipasi Anda!
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        Hak suara Anda telah berhasil dikirim dan tersimpan secara rahasia ke dalam sistem e-voting.
                    </p>

                    {/* Transaction / Reference Code Card */}
                    <div className="bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl mb-8">
                        <p className="text-[11px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                            Kode Bukti Digital (Terenkripsi)
                        </p>
                        <p className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                            {refCode}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            Simpan kode ini sebagai bukti sah bahwa Anda telah memberikan suara.
                        </p>
                    </div>

                    {/* Tombol Navigasi Utama: Ke Dashboard */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.visit('/dashboard')}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 group"
                        >
                            <Home className="h-4 w-4" />
                            <span>Kembali ke Dashboard</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => router.visit('/live-count')}
                            className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                        >
                            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span>Pantau Live Count Real-Time</span>
                        </button>
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