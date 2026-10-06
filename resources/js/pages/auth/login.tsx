import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        nik: '',
        birth_date: '',
    });

    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error' | null;
        text: string;
    }>({ type: null, text: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setStatusMessage({ type: null, text: '' });

        post('/api/v1/auth/login-nik', {
            onSuccess: (page) => {
                // Cek flash message dari backend
                const flash = page.props.flash as { success?: string; error?: string };

                if (flash?.error) {
                    setStatusMessage({
                        type: 'error',
                        text: flash.error,
                    });
                } else if (flash?.success) {
                    setStatusMessage({
                        type: 'success',
                        text: 'Login berhasil! Mengalihkan...',
                    });
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                }
            },
            onError: (errs) => {
                // Jika gagal validasi (misal NIK kurang dari 16 digit)
                setStatusMessage({
                    type: 'error',
                    text: errs.nik || errs.birth_date || 'Data input tidak valid!',
                });
            },
        });
    };

    return (
        <AuthLayout title="Pemilihan Kepala Desa Durian Runtuh" description="Masukkan NIK dan Tanggal Lahir sesuai KTP">
            <Head title="Wira Ganteng" />

            {statusMessage.type && (
                <div
                    className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${
                        statusMessage.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                >
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nik">NIK (16 Digit)</Label>
                        <Input
                            id="nik"
                            type="text"
                            name="nik"
                            maxLength={16}
                            value={data.nik}
                            className="mt-1 block w-full"
                            placeholder="Contoh: 5101011205980001"
                            onChange={(e) => setData('nik', e.target.value)}
                            required
                        />
                        <InputError message={errors.nik} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="birth_date">Tanggal Lahir (Tahun-Bulan-Tanggal)</Label>
                        <Input
                            id="birth_date"
                            type="text"
                            name="birth_date"
                            value={data.birth_date}
                            maxLength={10}
                            className="mt-1 block w-full"
                            placeholder="YYYY-MM-DD (Contoh: 2000-08-25)"
                            onChange={(e) => setData('birth_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.birth_date} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Masuk
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}