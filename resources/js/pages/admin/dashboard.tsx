import { ThemeToggle } from '@/components/theme-toggle';
import { Head, router, useForm } from '@inertiajs/react';
import { BarChart3, CheckCircle2, Clock, LogOut, Pencil, Plus, RotateCcw, Search, ShieldAlert, Trash2, UserCheck, Users, Vote } from 'lucide-react';
import { useState } from 'react';

interface Voter {
    id: number;
    nik: string;
    name: string;
    rt_rw: string;
    has_voted: boolean;
}

interface Candidate {
    id: number;
    candidate_number: string;
    name: string;
    vice_name: string;
    votes: number;
    photo_url?: string;
}

interface AdminDashboardProps {
    stats: {
        total_dpt: number;
        total_voted: number;
        total_unvoted: number;
        total_candidates: number;
    };
    voters: Voter[];
    candidates: Candidate[];
}

export default function AdminDashboard({ stats, voters, candidates }: AdminDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, reset, errors, processing } = useForm({
        nik: '',
        name: '',
        rt_rw: '',
    });

    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

    const candidateForm = useForm<{
        candidate_number: string;
        name: string;
        vice_name: string;
        vision_mission: string;
        photo: File | null;
    }>({
        candidate_number: '',
        name: '',
        vice_name: '',
        vision_mission: '',
        photo: null,
    });

    const handleOpenAddCandidate = () => {
        setEditingCandidate(null);
        candidateForm.setData({
            candidate_number: '',
            name: '',
            vice_name: '',
            vision_mission: '',
            photo: null,
        });
        setIsCandidateModalOpen(true);
    };

    const handleOpenEditCandidate = (cand: Candidate) => {
        setEditingCandidate(cand);
        candidateForm.setData({
            candidate_number: cand.candidate_number,
            name: cand.name,
            vice_name: cand.vice_name,
            vision_mission: '',
            photo: null,
        });
        setIsCandidateModalOpen(true);
    };

    const handleSaveCandidate = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCandidate) {
            // Kirim sebagai POST biasa ke route update
            router.post(`/admin/candidates/${editingCandidate.id}`, candidateForm.data, {
                forceFormData: true,
                onSuccess: () => {
                    setIsCandidateModalOpen(false);
                    candidateForm.reset();
                },
                onError: (errors) => {
                    console.error('Validation Error:', errors);
                }
            });
        } else {
            router.post('/admin/candidates', candidateForm.data, {
                forceFormData: true,
                onSuccess: () => {
                    setIsCandidateModalOpen(false);
                    candidateForm.reset();
                },
                onError: (errors) => {
                    console.error('Validation Error:', errors);
                }
            });
        }
    };

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'candidate' | 'voter' | 'reset-voter' | 'reset-election';
        id?: number;
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'candidate',
        title: '',
        message: '',
    });
    const handleDeleteCandidate = (id: number) => {
        setDeleteModal({
            isOpen: true,
            type: 'candidate',
            id,
            title: 'Hapus Pasangan Calon',
            message: 'Apakah Anda yakin ingin menghapus pasangan calon ini dari sistem PEMIRA?',
        });
    };
    const handleAddVoter = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/voters', {
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
            },
        });
    };

    const handleAdminLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari Panel Admin?')) {
            router.post('/admin/logout');
        }
    };

    const handleResetVoter = (id: number) => {
        setDeleteModal({
            isOpen: true,
            type: 'reset-voter',
            id,
            title: 'Reset Status Voting',
            message: 'Apakah Anda yakin ingin mereset status voting pemilih ini agar dapat mencoblos kembali?',
        });
    };

    const handleDeleteVoter = (id: number) => {
        setDeleteModal({
            isOpen: true,
            type: 'voter',
            id,
            title: 'Hapus Pemilih (DPT)',
            message: 'Apakah Anda yakin ingin menghapus data pemilih ini dari daftar DPT?',
        });
    };

    const handleResetElection = () => {
        setDeleteModal({
            isOpen: true,
            type: 'reset-election',
            title: 'PERINGATAN: Reset Total Pemilihan',
            message: 'Tindakan ini akan MENGHAPUS SELURUH suara yang masuk dan MERESET status seluruh DPT. Yakin ingin melanjutkan?',
        });
    };

    // Fungsi Eksekusi Aksi setelah Klik "Ya, Lanjutkan"
    const handleConfirmAction = () => {
        if (deleteModal.type === 'candidate' && deleteModal.id) {
            router.delete(`/admin/candidates/${deleteModal.id}`);
        } else if (deleteModal.type === 'voter' && deleteModal.id) {
            router.delete(`/admin/voters/${deleteModal.id}`);
        } else if (deleteModal.type === 'reset-voter' && deleteModal.id) {
            router.post(`/admin/voters/${deleteModal.id}/reset`);
        } else if (deleteModal.type === 'reset-election') {
            router.post('/admin/reset-election');
        }

        setDeleteModal({ ...deleteModal, isOpen: false });
    };
    const filteredVoters = voters.filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.nik.includes(searchTerm));

    return (
        <div className="relative flex min-h-screen flex-col justify-between bg-slate-50 text-slate-900 transition-colors duration-300 selection:bg-blue-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
            <Head title="Panel Admin - E-Voting Pilkades" />

            {/* Top Bar Header */}
            <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-slate-200 px-6 py-6 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md">
                        <Vote className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg leading-none font-extrabold tracking-tight text-slate-900 dark:text-white">Panel Admin PEMIRA</h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Manajemen DPT & Kontrol Pemilihan</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    <button
                        onClick={() => router.visit('/live-count')}
                        className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Live Count</span>
                    </button>

                    <button
                        onClick={handleResetElection}
                        className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400"
                    >
                        <ShieldAlert className="h-4 w-4" />
                        <span className="hidden sm:inline">Reset Pemilihan</span>
                    </button>

                    {/* Tombol Logout Admin */}
                    <button
                        onClick={handleAdminLogout}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-800 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">Total DPT</p>
                            <h3 className="mt-0.5 text-2xl font-black text-slate-900 dark:text-white">{stats.total_dpt}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">Sudah Memilih</p>
                            <h3 className="mt-0.5 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.total_voted}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">Belum Memilih</p>
                            <h3 className="mt-0.5 text-2xl font-black text-amber-600 dark:text-amber-400">{stats.total_unvoted}</h3>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">Total Paslon</p>
                            <h3 className="mt-0.5 text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.total_candidates}</h3>
                        </div>
                    </div>
                </div>

                {/* Section Manajemen & Perolehan Suara Paslon */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manajemen Pasangan Calon</h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Kelola paslon dan pantau perolehan suara</p>
                        </div>
                        <button
                            onClick={handleOpenAddCandidate}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Paslon</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {candidates.map((cand) => (
                            <div
                                key={cand.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                            >
                                <div>
                                    <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-extrabold text-white">
                                        Paslon {cand.candidate_number}
                                    </span>
                                    <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{cand.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Wakil: {cand.vice_name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{cand.votes}</span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Suara</p>
                                    </div>
                                    <div className="flex flex-col gap-1 border-l border-slate-200 pl-3 dark:border-slate-800">
                                        <button
                                            onClick={() => handleOpenEditCandidate(cand)}
                                            className="rounded-lg bg-amber-50 p-1.5 text-amber-600 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCandidate(cand.id)}
                                            className="rounded-lg bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section Tabel DPT (Pemilih) */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center dark:border-slate-800">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Pemilih Tetap (DPT)</h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Kelola akun dan status hak pilih warga</p>
                        </div>

                        <div className="flex w-full items-center gap-3 md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari NIK / Nama..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 pr-4 pl-9 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah DPT</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">NIK</th>
                                    <th className="px-6 py-4">Nama Pemilih</th>
                                    <th className="px-6 py-4">RT / RW</th>
                                    <th className="px-6 py-4">Status Voting</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredVoters.map((voter) => (
                                    <tr key={voter.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-6 py-4 font-mono font-medium">{voter.nik}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{voter.name}</td>
                                        <td className="px-6 py-4">{voter.rt_rw || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                                    voter.has_voted
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                }`}
                                            >
                                                {voter.has_voted ? 'Sudah Memilih' : 'Belum Memilih'}
                                            </span>
                                        </td>
                                        <td className="flex items-center justify-center gap-2 px-6 py-4">
                                            {voter.has_voted && (
                                                <button
                                                    onClick={() => handleResetVoter(voter.id)}
                                                    title="Reset Status Voting"
                                                    className="rounded-lg bg-amber-50 p-1.5 text-amber-600 transition hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400"
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteVoter(voter.id)}
                                                title="Hapus Pemilih"
                                                className="rounded-lg bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Tambah DPT */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Tambah DPT Baru</h3>

                        <form onSubmit={handleAddVoter} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">NIK (16 Digit)</label>
                                <input
                                    type="text"
                                    required
                                    value={data.nik}
                                    onChange={(e) => setData('nik', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                                {errors.nik && <p className="mt-1 text-[10px] text-rose-500">{errors.nik}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">RT / RW (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 001/002"
                                    value={data.rt_rw}
                                    onChange={(e) => setData('rt_rw', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                                >
                                    {processing ? 'Simpan...' : 'Simpan DPT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal Tambah/Edit Paslon */}
            {isCandidateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                            {editingCandidate ? 'Edit Data Paslon' : 'Tambah Paslon Baru'}
                        </h3>

                        <form onSubmit={handleSaveCandidate} className="space-y-4">
                            {/* 1. Nomor Urut Paslon */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Nomor Urut Paslon</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: 01"
                                    value={candidateForm.data.candidate_number}
                                    onChange={(e) => candidateForm.setData('candidate_number', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            {/* 2. Nama Calon Ketua */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Nama Calon Ketua</label>
                                <input
                                    type="text"
                                    required
                                    value={candidateForm.data.name}
                                    onChange={(e) => candidateForm.setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            {/* 3. Nama Calon Wakil */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Nama Calon Wakil</label>
                                <input
                                    type="text"
                                    required
                                    value={candidateForm.data.vice_name}
                                    onChange={(e) => candidateForm.setData('vice_name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                            </div>

                            {/* 4. Upload Foto Kandidat (Cukup 1 Saja di Sini) */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Upload Foto Kandidat</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            candidateForm.setData('photo', e.target.files[0]);
                                        }
                                    }}
                                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                />
                                <p className="mt-1 text-[10px] text-slate-400">Format: JPG, PNG, WEBP (Maksimal 2MB)</p>
                            </div>

                            {/* 5. Tombol Aksi */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCandidateModalOpen(false)}
                                    className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={candidateForm.processing}
                                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:opacity-50"
                                >
                                    {candidateForm.processing ? 'Menyimpan...' : 'Simpan Paslon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal Pop-up Konfirmasi Kustom */}
            {deleteModal.isOpen && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm duration-200">
                    <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-2xl p-3 ${
                                    deleteModal.type === 'reset-election'
                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">{deleteModal.title}</h3>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Konfirmasi tindakan administrator</p>
                            </div>
                        </div>

                        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                            {deleteModal.message}
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAction}
                                className={`flex-1 rounded-xl py-2.5 text-xs font-semibold text-white shadow-lg transition ${
                                    deleteModal.type === 'reset-election' || deleteModal.type === 'candidate' || deleteModal.type === 'voter'
                                        ? 'bg-rose-600 shadow-rose-600/20 hover:bg-rose-500'
                                        : 'bg-amber-600 shadow-amber-600/20 hover:bg-amber-500'
                                }`}
                            >
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Footer */}
            <footer className="mx-auto w-full max-w-7xl px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} Panitia Pemilihan Kepala Desa Digital (E-Voting Admin).
            </footer>
        </div>
    );
}
