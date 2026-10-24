import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, Lock, User, Vote } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden selection:bg-blue-500 selection:text-white">
            <Head title="Login Admin - E-Voting Pilkades" />

            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />

            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                        <Vote className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                            E-Voting Pilkades
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Portal Administrator</p>
                    </div>
                </div>
                <ThemeToggle />
            </header>

            <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-center z-10">
                <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
                    <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl w-fit mb-4">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Masuk Panel Admin</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
                        Silakan autentikasi kredensial pengelola pemilihan.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username</label>
                            <div className="relative">
                                <User className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Masukkan username admin"
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            {errors.username && <p className="text-[10px] text-rose-500 mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 text-xs transition mt-2"
                        >
                            {processing ? 'Memverifikasi...' : 'Masuk Panel Admin'}
                        </button>
                    </form>
                </div>
            </main>

            <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} Panitia Pemilihan Kepala Desa Digital.
            </footer>
        </div>
    );
}