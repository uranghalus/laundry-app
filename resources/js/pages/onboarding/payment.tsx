import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/components/ui/card';
import { CreditCard, Smartphone, QrCode, Loader2 } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { process } from '@/routes/onboarding/payment';

interface Plan {
    name: string;
    price: number;
    billing_period: 'monthly' | 'annual';
}

interface Tenant {
    name: string;
}

interface PaymentMethod {
    id: string;
    name: string;
}

interface Props {
    plan: Plan;
    tenant: Tenant;
    payment_methods: PaymentMethod[];
}

export default function OnboardingPayment({ plan, payment_methods }: Props) {
    const {
        data,
        setData,
        post: submit,
        processing,
        errors,
    } = useForm({
        payment_method: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(process().url);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getMethodIcon = (methodId: string) => {
        switch (methodId) {
            case 'xendit_va':
                return <CreditCard className="h-5 w-5" />;
            case 'xendit_qris':
                return <QrCode className="h-5 w-5" />;
            case 'xendit_ewallet':
                return <Smartphone className="h-5 w-5" />;
            default:
                return <CreditCard className="h-5 w-5" />;
        }
    };

    return (
        <>
            <Head title="Pembayaran - Onboarding" />
            <div className="container mx-auto max-w-2xl px-4 py-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="border-primary text-primary flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <span className="text-muted-foreground text-sm font-medium">
                                Pilih Plan
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                2
                            </div>
                            <span className="text-sm font-medium">
                                Pembayaran
                            </span>
                        </div>
                    </div>
                    <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                        <div className="bg-primary h-full w-full transition-all duration-300" />
                    </div>
                </div>

                {/* Plan Summary */}
                <Card className="border-primary/50 bg-primary/5 mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription>
                                    {plan.billing_period === 'annual'
                                        ? 'Tagihan Tahunan (2 bulan gratis)'
                                        : 'Tagihan Bulanan'}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">
                                    {formatPrice(plan.price)}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    Total yang dibayar hari ini
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <h1 className="mb-2 text-2xl font-bold">
                    Pilih Metode Pembayaran
                </h1>
                <p className="text-muted-foreground mb-6">
                    Pembayaran diproses melalui Xendit (Payment Gateway resmi
                    Bank Indonesia). Anda akan diarahkan ke halaman pembayaran
                    yang aman.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        {payment_methods.map((method) => (
                            <Card
                                key={method.id}
                                className={`relative cursor-pointer border-2 transition-all ${
                                    data.payment_method === method.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted/50 hover:border-muted'
                                }`}
                                onClick={() =>
                                    setData('payment_method', method.id)
                                }
                            >
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                                            {getMethodIcon(method.id)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {method.name}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {method.id === 'xendit_va' &&
                                                    'Virtual Account BCA, BNI, Mandiri, BRI, dll'}
                                                {method.id === 'xendit_qris' &&
                                                    'Scan QRIS dari aplikasi e-wallet/banking favorit'}
                                                {method.id ===
                                                    'xendit_ewallet' &&
                                                    'OVO, DANA, ShopeePay, GoPay, LinkAja'}
                                            </p>
                                        </div>
                                        {data.payment_method === method.id && (
                                            <svg
                                                className="text-primary h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {errors.payment_method && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                            {errors.payment_method}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="mt-6 w-full"
                        disabled={processing || !data.payment_method}
                    >
                        {processing && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {processing
                            ? 'Mengarahkan ke Payment Gateway...'
                            : 'Bayar Sekarang'}
                    </Button>
                </form>

                {/* Security Notice */}
                <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-start gap-3">
                        <svg
                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <p className="font-medium text-green-800">
                                Pembayaran Aman
                            </p>
                            <p className="mt-1 text-sm text-green-700">
                                Transaksi diproses melalui Xendit yang terdaftar
                                di OJK dan Bank Indonesia. Data kartu/kredit
                                Anda tidak disimpan di server kami.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Development Skip */}
                <div className="mt-6 border-t pt-6">
                    <p className="text-muted-foreground mb-2 text-center text-sm">
                        Development mode
                    </p>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            if (
                                confirm(
                                    'Aktifkan subscription tanpa pembayaran? (Hanya development)',
                                )
                            ) {
                                void fetch('/onboarding/skip-payment', {
                                    method: 'POST',
                                }).then(() => window.location.reload());
                            }
                        }}
                    >
                        Skip Payment (Dev Only)
                    </Button>
                </div>
            </div>
        </>
    );
}

OnboardingPayment.layout = {
    title: 'Pembayaran Subscription',
    description: 'Lakukan pembayaran untuk mengaktifkan subscription Anda',
};
