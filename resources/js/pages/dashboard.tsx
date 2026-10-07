import { Head, router } from '@inertiajs/react';
import { LogOut, CheckCircle2, User, Vote, ShieldCheck, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface Voter {
    id: number;
    nik: string;
    name: string;
    rt_rw: string;
    has_voted: boolean;
}

interface DashboardProps {
    voter: Voter;
}

export default function Dashboard({ voter }: DashboardProps) {
    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden selection:bg-blue-500 selection:text-white">
            <Head title="Dashboard Pemilih - E-Voting Pilkades" />

            {/* Background Glow Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />

            {/* Header / Navbar */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/20 dark:border-blue-500/30 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm dark:shadow-lg dark:shadow-blue-500/10">
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
                    {/* Tombol Live Count */}
                    <button
                        onClick={() => router.visit('/live-count')}
                        className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Live Count</span>
                    </button>

                    {/* Switcher Mode (Light/Dark) */}
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300 backdrop-blur shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Luber Jurdil & Terenkripsi</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col justify-center z-10">
                
                {/* Banner Status Login */}
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-3 text-sm shadow-sm transition-colors duration-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">Autentikasi Berhasil!</p>
                        <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 mt-0.5">
                            Anda terdaftar dalam Daftar Pemilih Tetap (DPT).
                        </p>
                    </div>
                </div>

                {/* Card Utama Profil & Status */}
                <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-xl dark:shadow-2xl text-slate-900 dark:text-slate-100 relative transition-colors duration-300">
                    
                    {/* Header Profil Pemilih */}
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
                        <div className="p-3 bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/20 dark:border-blue-500/30 rounded-2xl text-blue-600 dark:text-blue-400">
                            <User className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{voter.name}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Status: Pemilih Aktif DPT</p>
                        </div>
                    </div>

                    {/* Detail Informasi */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                NIK
                            </p>
                            <p className="font-mono font-medium text-sm text-slate-800 dark:text-slate-200">{voter.nik}</p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                RT / RW
                            </p>
                            <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{voter.rt_rw || '-'}</p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col justify-center">
                            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                Status Voting
                            </p>
                            <div>
                                <span
                                    className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                                        voter.has_voted
                                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                                    }`}
                                >
                                    {voter.has_voted ? 'Sudah Memilih' : 'Belum Memilih'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div>
                        {voter.has_voted ? (
                            <div className="space-y-3">
                                <button
                                    disabled
                                    className="w-full py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold rounded-xl text-sm cursor-not-allowed text-center border border-slate-300 dark:border-slate-700/50"
                                >
                                    Anda Sudah Menggunakan Hak Pilih
                                </button>

                                <button
                                    onClick={() => router.visit('/live-count')}
                                    className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                                >
                                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span>Lihat Hasil Sementara (Live Count)</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => router.visit('/vote')}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 text-sm text-center"
                            >
                                Mulai Kirim Suara / Pilih Paslon
                            </button>
                        )}
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