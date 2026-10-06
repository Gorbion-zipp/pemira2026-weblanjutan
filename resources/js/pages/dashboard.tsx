import { Head, router } from '@inertiajs/react';
import { LogOut, CheckCircle2, User, FileText, Home } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <Head title="Dashboard Pemilih - Pilkades" />

            {/* Header / Navbar */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Home className="h-6 w-6 text-blue-500" />
                    <h1 className="font-bold text-lg">E-Voting Pilkades</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm font-medium transition"
                >
                    <LogOut className="h-4 w-4" />
                    Keluar
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6 justify-center">
                {/* Banner Status Login */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                    <div>
                        <p className="font-semibold text-sm">Autentikasi Berhasil!</p>
                        <p className="text-xs opacity-80">Anda terdaftar dalam Daftar Pemilih Tetap (DPT).</p>
                    </div>
                </div>

                {/* Card Info Pemilih */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-700/60 pb-4">
                        <User className="h-8 w-8 text-blue-400" />
                        <div>
                            <h2 className="text-xl font-bold">{voter.name}</h2>
                            <p className="text-xs text-slate-400">Status: Pemilih Aktif</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-400 mb-1">NIK</p>
                            <p className="font-mono font-medium text-slate-200">{voter.nik}</p>
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-400 mb-1">RT / RW</p>
                            <p className="font-medium text-slate-200">{voter.rt_rw || '-'}</p>
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-400 mb-1">Status Voting</p>
                            <span
                                className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                    voter.has_voted
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/20 text-amber-400'
                                }`}
                            >
                                {voter.has_voted ? 'Sudah Memilih' : 'Belum Memilih'}
                            </span>
                        </div>
                    </div>

                    {/* Tombol Aksi Voting */}
                    <div className="pt-2">
                        {voter.has_voted ? (
                            <button
                                disabled
                                className="w-full py-3 bg-slate-700 text-slate-400 font-semibold rounded-xl cursor-not-allowed text-center"
                            >
                                Anda Sudah Menggunakan Hak Pilih
                            </button>
                        ) : (
                            <button
                                onClick={() => alert('Fitur voting akan dibuka pada tahap selanjutnya!')}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition text-center"
                            >
                                Mulai Kirim Suara / Pilih Paslon
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}