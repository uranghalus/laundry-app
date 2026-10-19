import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { post } from '@/routes/onboarding/plan/select';

interface Plan {
    id: number;
    name: string;
    price_monthly: number;
    price_annual: number;
    feature_flags: Record<string, boolean | number | null>;
    max_outlets: number | null;
    max_users: number | null;
    max_photos_per_month: number | null;
}

interface Tenant {
    name: string;
    business_type: 'single' | 'multi';
    trial_ends_at: string;
}

interface Props {
    plans: Plan[];
    tenant: Tenant;
}

export default function OnboardingPlan({ plans, tenant }: Props) {
    const { data, setData, post: submit, processing, errors } = useForm({
        plan_id: '',
        billing_period: 'monthly',
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

    const getFeatures = (plan: Plan) => {
        const features = [];
        if (plan.feature_flags.proof_of_condition) {
            features.push({
                label: 'Digital Proof-of-Condition',
                detail: plan.feature_flags.proof_of_condition_cap
                    ? `Maks ${plan.feature_flags.proof_of_condition_cap} foto/bulan`
                    : 'Tanpa batas foto',
            });
        }
        if (plan.feature_flags.whatsapp_notifications) {
            features.push({ label: 'Notifikasi WhatsApp', detail: 'Otomatis ke pelanggan' });
        }
        if (plan.feature_flags.daily_reports) {
            features.push({ label: 'Laporan Harian', detail: 'Per outlet' });
        }
        if (plan.feature_flags.deposit_tracking) {
            features.push({ label: 'Tracking Deposit/Member', detail: '' });
        }
        if (plan.feature_flags.multi_outlet) {
            features.push({ label: 'Multi-Outlet', detail: `Maks ${plan.max_outlets} outlet` });
        }
        if (plan.feature_flags.rbac_full) {
            features.push({ label: 'RBAC Penuh', detail: 'Owner, Admin Outlet, Kasir' });
        }
        if (plan.feature_flags.consolidated_reports) {
            features.push({ label: 'Laporan Konsolidasi', detail: 'Lintas outlet' });
        }
        if (plan.feature_flags.full_audit_log) {
            features.push({ label: 'Audit Log Penuh', detail: 'Siap fraud detection v2' });
        }
        return features;
    };

    return (
        <>
            <Head title="Pilih Plan - Onboarding" />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                            <span className="text-sm font-medium text-muted-foreground">Pilih Plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-muted text-muted-foreground flex items-center justify-center text-sm font-medium">2</div>
                            <span className="text-sm font-medium text-muted-foreground">Pembayaran</span>
                        </div>
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 transition-all duration-300" />
                    </div>
                </div>

                {/* Tenant Info */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <h2 className="font-semibold">Selamat datang, {tenant.name}!</h2>
                    <p className="text-sm text-muted-foreground">
                        Tipe bisnis: {tenant.business_type === 'single' ? 'Single Outlet' : 'Multi Outlet'} •
                        Trial berakhir: {new Date(tenant.trial_ends_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>

                <h1 className="text-3xl font-bold mb-2">Pilih Plan yang Tepat</h1>
                <p className="text-muted-foreground mb-8">
                    Semua plan mencakup fitur inti: Order Management, Notifikasi WhatsApp, Proof-of-Condition, & Laporan.
                    Pilih berdasarkan skala bisnis Anda.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {plans.map((plan) => {
                            const isMultiOutlet = tenant.business_type === 'multi';
                            const isDisabled = isMultiOutlet && plan.name === 'Basic';
                            const monthlyPrice = plan.price_monthly;
                            const annualPrice = plan.price_annual;
                            const monthlySavings = monthlyPrice * 12 - annualPrice;

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative border-2 transition-all ${
                                        data.plan_id === plan.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted/50 hover:border-muted'
                                    } ${isDisabled ? 'opacity-50' : ''}`}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                                <CardDescription>
                                                    {plan.name === 'Basic' ? 'Untuk single outlet' : 'Untuk 2-5 outlet'}
                                                </CardDescription>
                                            </div>
                                            {data.plan_id === plan.id && (
                                                <Check className="w-5 h-5 text-primary" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold">
                                                    {formatPrice(data.billing_period === 'annual' ? annualPrice : monthlyPrice)}
                                                </span>
                                                <span className="text-muted-foreground">/bulan</span>
                                            </div>
                                            {data.billing_period === 'annual' && (
                                                <p className="text-sm text-green-600">
                                                    Hemat {formatPrice(monthlySavings)}/tahun (2 bulan gratis)
                                                </p>
                                            )}
                                        </div>

                                        <div className="border-t pt-4 space-y-3">
                                            {getFeatures(plan).map((feature, index) => (
                                                <div key={index} className="flex items-start gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium">{feature.label}</span>
                                                        {feature.detail && (
                                                            <span className="text-muted-foreground ml-2">{feature.detail}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                type="radio"
                                                name="plan_id"
                                                value={plan.id}
                                                checked={data.plan_id === plan.id}
                                                onChange={() => setData('plan_id', plan.id)}
                                                disabled={isDisabled}
                                                className="h-4 w-4 text-primary border-muted focus:ring-primary"
                                            />
                                            <label
                                                htmlFor={`plan-${plan.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                Pilih {plan.name}
                                            </label>
                                        </div>
                                        {isDisabled && (
                                            <p className="text-xs text-red-600 text-center">
                                                Multi-outlet harus memilih plan Pro
                                            </p>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Billing Period Selector */}
                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                        <label className="block text-sm font-medium mb-3">Siklus Tagihan</label>
                        <div className="flex gap-4">
                            {['monthly', 'annual'].map((period) => (
                                <label
                                    key={period}
                                    className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border-2 transition-all ${
                                        data.billing_period === period
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted/50 hover:border-muted'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="billing_period"
                                        value={period}
                                        checked={data.billing_period === period}
                                        onChange={() => setData('billing_period', period)}
                                        className="h-4 w-4 text-primary border-muted focus:ring-primary"
                                    />
                                    <div>
                                        <span className="font-medium capitalize">{period === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
                                        <p className="text-xs text-muted-foreground">
                                            {period === 'monthly'
                                                ? `Rp${formatPrice(plans.find(p => data.plan_id === p.id)?.price_monthly || 0)}/bulan`
                                                : `Rp${formatPrice(plans.find(p => data.plan_id === p.id)?.price_annual || 0)}/tahun (2 bln gratis)`}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {errors.plan_id && (
                        <p className="text-red-600 text-sm" role="alert">{errors.plan_id}</p>
                    )}

                    <Button
                        type="submit"
                        className="mt-6 w-full lg:w-auto"
                        disabled={processing || !data.plan_id}
                    >
                        {processing ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                    </Button>
                </form>

                {/* Development Skip */}
                <div className="mt-8 pt-8 border-t">
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

OnboardingPlan.layout = {
    title: 'Pilih Plan',
    description: 'Pilih plan subscription yang sesuai dengan kebutuhan bisnis Anda',
};