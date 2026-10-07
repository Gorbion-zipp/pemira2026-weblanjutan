import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Vote, 
    ShieldCheck, 
    Calendar, 
    IdCard, 
    ArrowRight, 
    Lock, 
    CheckCircle2, 
    AlertCircle,
    Info
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface FlashProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Login({ flash }: FlashProps) {
    const { data, setData, post, processing, errors } = useForm({
        nik: '',
        birth_date: '',
    });

    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error' | null;
        text: string | null;
    }>({
        type: flash?.error ? 'error' : flash?.success ? 'success' : null,
        text: flash?.error || flash?.success || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage({ type: null, text: null });

        post('/api/v1/auth/login-nik', {
            onSuccess: (page) => {
                if (page.props.flash?.error) {
                    setStatusMessage({
                        type: 'error',
                        text: page.props.flash.error,
                    });
                } else {
                    setStatusMessage({
                        type: 'success',
                        text: 'Autentikasi Berhasil! Mengalihkan ke Dashboard...',
                    });
                }
            },
            onError: (errs) => {
                const errorMsg =
                    errs.nik ||
                    errs.birth_date ||
                    'Gagal memverifikasi identitas. Periksa kembali NIK dan Tanggal Lahir Anda.';
                setStatusMessage({
                    type: 'error',
                    text: errorMsg,
                });
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden selection:bg-blue-500 selection:text-white">
            <Head title="Masuk DPT - E-Voting Pilkades" />

            {/* Background Glow Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />

            {/* Top Bar / Header */}
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
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300 backdrop-blur shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Luber Jurdil & Terenkripsi</span>
                    </div>
                </div>
            </header>

            {/* Main Content / Form Section */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl dark:shadow-2xl relative transition-colors duration-300">
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold mb-6">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Autentikasi Pemilih DPT</span>
                        </div>

                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                            Verifikasi Identitas
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Masukkan NIK dan Tanggal Lahir sesuai dengan data yang terdaftar pada DPT Desa.
                        </p>

                        {statusMessage.text && (
                            <div
                                className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-sm transition-all duration-300 ${
                                    statusMessage.type === 'success'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
                                }`}
                            >
                                {statusMessage.type === 'success' ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                                )}
                                <div className="font-medium leading-snug">{statusMessage.text}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Nomor Induk Kependudukan (NIK)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                        <IdCard className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={16}
                                        value={data.nik}
                                        onChange={(e) => setData('nik', e.target.value.replace(/\D/g, ''))}
                                        placeholder="16 Digit NIK KTP Anda"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                {errors.nik && (
                                    <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400">{errors.nik}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                                    Tanggal Lahir (YYYY-MM-DD)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                        placeholder="Tahun-Bulan-Tanggal (Contoh: 2000-08-25)"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                {errors.birth_date && (
                                    <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400">{errors.birth_date}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
                            >
                                {processing ? (
                                    <span className="inline-flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memverifikasi DPT...
                                    </span>
                                ) : (
                                    <>
                                        <span>Masuk & Verifikasi DPT</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span>Hak pilih Anda dijamin rahasia dan hanya dapat digunakan 1 kali pencoblosan.</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 z-10">
                &copy; {new Date().getFullYear()} Panitia Pemilihan Kepala Desa Digital (E-Voting). All rights reserved.
            </footer>
        </div>
    );
}