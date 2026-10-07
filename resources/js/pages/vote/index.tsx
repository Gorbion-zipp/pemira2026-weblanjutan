import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Vote, 
    ShieldCheck, 
    AlertTriangle, 
    ArrowLeft 
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface Candidate {
    id: number;
    candidate_number: string;
    name: string;
    vice_name: string;
    vision_mission: string;
    photo_url: string;
}

interface VoteProps {
    candidates?: Candidate[];
}

export default function VotePage({ candidates }: VoteProps) {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultCandidates: Candidate[] = [
        {
            id: 1,
            candidate_number: '01',
            name: 'Dede Ganteng',
            vice_name: 'I Made Budiasa',
            vision_mission: 'Mewujudkan Desa Digital yang Transparan, Maju, dan Sejahtera.',
            photo_url: '/images/dede.png',
        },
        {
            id: 2,
            candidate_number: '02',
            name: 'I Putu Wirayudha Brahmananda',
            vice_name: 'I Ketut Agus',
            vision_mission: 'Mengembangkan Potensi Ekonomi Lokal dan Pemberdayaan Pemuda Desa.',
            photo_url: '/images/nanda.png',
        },
    ];

    const candidateList = candidates && candidates.length > 0 ? candidates : defaultCandidates;

    const handleSelect = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsConfirmOpen(true);
    };

    const handleConfirmVote = () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);

    router.post('/vote/submit', {
        candidate_id: selectedCandidate.id,
    }, {
        onSuccess: () => {
            setIsConfirmOpen(false);
        },
        onError: (errors) => {
            console.error('Error vote:', errors);
            alert('Gagal mengirim suara. Silakan coba lagi!');
        },
        onFinish: () => {
            setIsSubmitting(false);
        },
    });
};

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-hidden transition-colors duration-300">
            <Head title="Bilik Suara - E-Voting Pilkades" />

            {/* Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />

            {/* Top Bar */}
            <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.visit('/dashboard')}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition shadow-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                            Bilik Suara Digital
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pilih Pasangan Calon Kepala Desa</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300 backdrop-blur shadow-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Pilihan Rahasia & Rahasia</span>
                    </div>
                </div>
            </header>

            {/* Main Section */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 z-10 flex flex-col justify-center">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Gunakan Hak Pilih Anda
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
                        Klik pada kartu Pasangan Calon di bawah ini untuk menentukan pilihan Anda.
                    </p>
                </div>

                {/* Candidate Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
                    {candidateList.map((cand) => (
                        <div
                            key={cand.id}
                            onClick={() => handleSelect(cand)}
                            className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl dark:shadow-2xl relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white font-extrabold text-sm rounded-xl shadow-lg z-10">
                                No. {cand.candidate_number}
                            </div>

                            <div>
                                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800">
                                    <img
                                        src={cand.photo_url}
                                        alt={cand.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{cand.name}</h3>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                                    Wakil: {cand.vice_name}
                                </p>

                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
                                    "{cand.vision_mission}"
                                </p>
                            </div>

                            <button
                                type="button"
                                className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                <Vote className="h-4 w-4" />
                                <span>Pilih Paslon {cand.candidate_number}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Modal Konfirmasi */}
            {isConfirmOpen && selectedCandidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
                        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/50">
                                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Konfirmasi Pilihan</h3>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            Apakah Anda yakin ingin memilih <strong className="text-slate-900 dark:text-white">Paslon No. {selectedCandidate.candidate_number} ({selectedCandidate.name})</strong>? Pilihan bersifat final dan tidak dapat diubah setelah dikirim.
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsConfirmOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition"
                            >
                                Cek Kembali
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmVote}
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Ya, Kirim Suara'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400 z-10">
                &copy; {new Date().getFullYear()} Panitia Pemilihan Kepala Desa Digital (E-Voting). All rights reserved.
            </footer>
        </div>
    );
}