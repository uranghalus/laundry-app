import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Laundry SaaS" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors, setData }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap Anda"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Nomor HP (WhatsApp)</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="081234567890"
                                    inputMode="numeric"
                                />
                                <InputError message={errors.phone} />
                                <p className="text-xs text-muted-foreground">
                                    Kami akan mengirim OTP verifikasi via WhatsApp ke nomor ini
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimal 8 karakter"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi Password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi password"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="business_type">Tipe Bisnis</Label>
                                <Select
                                    name="business_type"
                                    onValueChange={(value) => setData('business_type', value)}
                                    defaultValue="single"
                                >
                                    <SelectTrigger id="business_type">
                                        <SelectValue placeholder="Pilih tipe bisnis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single Outlet (1 gerai)</SelectItem>
                                        <SelectItem value="multi">Multi Outlet (2+ gerai)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.business_type} />
                                <p className="text-xs text-muted-foreground">
                                    Single: 1 outlet, 2 user. Multi: 2-5 outlet, user tak terbatas.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="outlet_name">Nama Outlet Pertama</Label>
                                <Input
                                    id="outlet_name"
                                    type="text"
                                    required
                                    tabIndex={6}
                                    name="outlet_name"
                                    placeholder="Nama outlet (contoh: Laundry Sejahtera)"
                                />
                                <InputError message={errors.outlet_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="outlet_address">Alamat Outlet</Label>
                                <Input
                                    id="outlet_address"
                                    type="text"
                                    required
                                    tabIndex={7}
                                    name="outlet_address"
                                    placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
                                />
                                <InputError message={errors.outlet_address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="outlet_whatsapp_number">Nomor WhatsApp Outlet</Label>
                                <Input
                                    id="outlet_whatsapp_number"
                                    type="tel"
                                    required
                                    tabIndex={8}
                                    name="outlet_whatsapp_number"
                                    placeholder="081234567890"
                                    inputMode="numeric"
                                />
                                <InputError message={errors.outlet_whatsapp_number} />
                                <p className="text-xs text-muted-foreground">
                                    Digunakan untuk mengirim notifikasi ke pelanggan
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={9}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Daftar & Mulai Trial 14 Hari
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={10}>
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Daftar Laundry SaaS',
    description: 'Isi data di bawah untuk membuat akun dan memulai trial 14 hari gratis',
};
