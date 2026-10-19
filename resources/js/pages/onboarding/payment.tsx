import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone, QrCode, Loader2 } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { post } from '@/routes/onboarding/payment/process';

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

export default function OnboardingPayment({ plan, tenant, payment_methods }: Props) {
    const { data, setData, post: submit, processing, errors } = useForm({
        payment_method: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(post());
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
                return <CreditCard className="w-5 h-5" />;
            case 'xendit_qris':
                return <QrCode className="w-5 h-5" />;
            case 'xendit_ewallet':
                return <Smartphone className="w-5 h-5" />;
            default:
                return <CreditCard className="w-5 h-5" />;
        }
    };

    return (
        <>
            <Head title="Pembayaran - Onboarding" />
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Pilih Plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                            <span className="text-sm font-medium">Pembayaran</span>
                        </div>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-full transition-all duration-300" />
                    </div>
                </div>

                {/* Plan Summary */}
                <Card className="mb-6 border-primary/50 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">{plan.name}</CardTitle>
                                <CardDescription>
                                    {plan.billing_period === 'annual' ? 'Tagihan Tahunan (2 bulan gratis)' : 'Tagihan Bulanan'}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{formatPrice(plan.price)}</p>
                                <p className="text-sm text-muted-foreground">Total yang dibayar hari ini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <h1 className="text-2xl font-bold mb-2">Pilih Metode Pembayaran</h1>
                <p className="text-muted-foreground mb-6">
                    Pembayaran diproses melalui Xendit (Payment Gateway resmi Bank Indonesia).
                    Anda akan diarahkan ke halaman pembayaran yang aman.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        {payment_methods.map((method) => (
                            <Card
                                key={method.id}
                                className={`relative border-2 transition-all cursor-pointer ${
                                    data.payment_method === method.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted/50 hover:border-muted'
                                }`}
                                onClick={() => setData('payment_method', method.id)}
                            >
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            {getMethodIcon(method.id)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{method.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {method.id === 'xendit_va' && 'Virtual Account BCA, BNI, Mandiri, BRI, dll'}
                                                {method.id === 'xendit_qris' && 'Scan QRIS dari aplikasi e-wallet/banking favorit'}
                                                {method.id === 'xendit_ewallet' && 'OVO, DANA, ShopeePay, GoPay, LinkAja'}
                                            </p>
                                        </div>
                                        {data.payment_method === method.id && (
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {errors.payment_method && (
                        <p className="text-red-600 text-sm mt-2" role="alert">{errors.payment_method}</p>
                    )}

                    <Button
                        type="submit"
                        className="mt-6 w-full"
                        disabled={processing || !data.payment_method}
                    >
                        {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {processing ? 'Mengarahkan ke Payment Gateway...' : 'Bayar Sekarang'}
                    </Button>
                </form>

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-medium text-green-800">Pembayaran Aman</p>
                            <p className="text-sm text-green-700 mt-1">
                                Transaksi diproses melalui Xendit yang terdaftar di OJK dan Bank Indonesia.
                                Data kartu/kredit Anda tidak disimpan di server kami.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Development Skip */}
                <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground text-center mb-2">
                        Development mode
                    </p>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            if (confirm('Aktifkan subscription tanpa pembayaran? (Hanya development)')) {
                                fetch('/onboarding/skip-payment', { method: 'POST' })
                                    .then(() => window.location.reload());
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