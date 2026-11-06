import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    resend as resendVerification,
    store as submitVerification,
} from '@/routes/onboarding/verify';

type Props = {
    phone: string;
};

/**
 * Halaman verifikasi nomor HP dengan kode OTP setelah registrasi.
 */
export default function VerifyPhone({ phone }: Props) {
    return (
        <>
            <Head title="Verifikasi Nomor HP" />

            <p className="text-muted-foreground text-center text-sm">
                Kode verifikasi 6 digit dikirim ke{' '}
                <span className="text-foreground font-medium">{phone}</span>.
            </p>

            <Form
                {...submitVerification.form()}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="code">Kode OTP</Label>
                            <Input
                                id="code"
                                name="code"
                                type="text"
                                required
                                autoFocus
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                placeholder="000000"
                                className="text-center text-lg tracking-[0.5em]"
                                aria-describedby="code-hint"
                            />
                            <p
                                id="code-hint"
                                className="text-muted-foreground text-xs"
                            >
                                Masukkan 6 digit angka tanpa spasi.
                            </p>
                            <InputError message={errors.code} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Verifikasi
                        </Button>
                    </>
                )}
            </Form>

            <Form
                {...resendVerification.form()}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <InputError message={errors.phone} />
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Kirim ulang kode
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyPhone.layout = {
    title: 'Verifikasi Nomor HP',
    description: 'Masukkan kode OTP untuk mengaktifkan akun Anda',
};
