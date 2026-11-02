import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { select } from '@/routes/onboarding/plan';

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
    const {
        data,
        setData,
        post: submit,
        processing,
        errors,
    } = useForm<{
        plan_id: number | null;
        billing_period: 'monthly' | 'annual';
    }>({
        plan_id: null,
        billing_period: 'monthly',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(select().url);
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
            features.push({
                label: 'Notifikasi WhatsApp',
                detail: 'Otomatis ke pelanggan',
            });
        }
        if (plan.feature_flags.daily_reports) {
            features.push({ label: 'Laporan Harian', detail: 'Per outlet' });
        }
        if (plan.feature_flags.deposit_tracking) {
            features.push({ label: 'Tracking Deposit/Member', detail: '' });
        }
        if (plan.feature_flags.multi_outlet) {
            features.push({
                label: 'Multi-Outlet',
                detail: `Maks ${plan.max_outlets} outlet`,
            });
        }
        if (plan.feature_flags.rbac_full) {
            features.push({
                label: 'RBAC Penuh',
                detail: 'Owner, Admin Outlet, Kasir',
            });
        }
        if (plan.feature_flags.consolidated_reports) {
            features.push({
                label: 'Laporan Konsolidasi',
                detail: 'Lintas outlet',
            });
        }
        if (plan.feature_flags.full_audit_log) {
            features.push({
                label: 'Audit Log Penuh',
                detail: 'Siap fraud detection v2',
            });
        }
        return features;
    };

    return (
        <>
            <Head title="Pilih Plan - Onboarding" />
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                                1
                            </div>
                            <span className="text-muted-foreground text-sm font-medium">
                                Pilih Plan
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="border-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium">
                                2
                            </div>
                            <span className="text-muted-foreground text-sm font-medium">
                                Pembayaran
                            </span>
                        </div>
                    </div>
                    <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                        <div className="bg-primary h-full w-1/2 transition-all duration-300" />
                    </div>
                </div>

                {/* Tenant Info */}
                <div className="bg-muted/50 mb-6 rounded-lg p-4">
                    <h2 className="font-semibold">
                        Selamat datang, {tenant.name}!
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Tipe bisnis:{' '}
                        {tenant.business_type === 'single'
                            ? 'Single Outlet'
                            : 'Multi Outlet'}{' '}
                        • Trial berakhir:{' '}
                        {new Date(tenant.trial_ends_at).toLocaleDateString(
                            'id-ID',
                            {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            },
                        )}
                    </p>
                </div>

                <h1 className="mb-2 text-3xl font-bold">
                    Pilih Plan yang Tepat
                </h1>
                <p className="text-muted-foreground mb-8">
                    Semua plan mencakup fitur inti: Order Management, Notifikasi
                    WhatsApp, Proof-of-Condition, & Laporan. Pilih berdasarkan
                    skala bisnis Anda.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {plans.map((plan) => {
                            const isMultiOutlet =
                                tenant.business_type === 'multi';
                            const isDisabled =
                                isMultiOutlet && plan.name === 'Basic';
                            const monthlyPrice = plan.price_monthly;
                            const annualPrice = plan.price_annual;
                            const monthlySavings =
                                monthlyPrice * 12 - annualPrice;

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
                                                <CardTitle className="text-xl">
                                                    {plan.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {plan.name === 'Basic'
                                                        ? 'Untuk single outlet'
                                                        : 'Untuk 2-5 outlet'}
                                                </CardDescription>
                                            </div>
                                            {data.plan_id === plan.id && (
                                                <Check className="text-primary h-5 w-5" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold">
                                                    {formatPrice(
                                                        data.billing_period ===
                                                            'annual'
                                                            ? annualPrice
                                                            : monthlyPrice,
                                                    )}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    /bulan
                                                </span>
                                            </div>
                                            {data.billing_period ===
                                                'annual' && (
                                                <p className="text-sm text-green-600">
                                                    Hemat{' '}
                                                    {formatPrice(
                                                        monthlySavings,
                                                    )}
                                                    /tahun (2 bulan gratis)
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-3 border-t pt-4">
                                            {getFeatures(plan).map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-2 text-sm"
                                                    >
                                                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                                        <div>
                                                            <span className="font-medium">
                                                                {feature.label}
                                                            </span>
                                                            {feature.detail && (
                                                                <span className="text-muted-foreground ml-2">
                                                                    {
                                                                        feature.detail
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <div className="flex w-full items-center gap-2">
                                            <input
                                                type="radio"
                                                name="plan_id"
                                                value={plan.id}
                                                checked={
                                                    data.plan_id === plan.id
                                                }
                                                onChange={() =>
                                                    setData('plan_id', plan.id)
                                                }
                                                disabled={isDisabled}
                                                className="text-primary border-muted focus:ring-primary h-4 w-4"
                                            />
                                            <label
                                                htmlFor={`plan-${plan.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                Pilih {plan.name}
                                            </label>
                                        </div>
                                        {isDisabled && (
                                            <p className="text-center text-xs text-red-600">
                                                Multi-outlet harus memilih plan
                                                Pro
                                            </p>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Billing Period Selector */}
                    <div className="bg-muted/50 mt-8 rounded-lg p-4">
                        <label className="mb-3 block text-sm font-medium">
                            Siklus Tagihan
                        </label>
                        <div className="flex gap-4">
                            {(['monthly', 'annual'] as const).map((period) => (
                                <label
                                    key={period}
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all ${
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
                                        onChange={() =>
                                            setData('billing_period', period)
                                        }
                                        className="text-primary border-muted focus:ring-primary h-4 w-4"
                                    />
                                    <div>
                                        <span className="font-medium capitalize">
                                            {period === 'monthly'
                                                ? 'Bulanan'
                                                : 'Tahunan'}
                                        </span>
                                        <p className="text-muted-foreground text-xs">
                                            {period === 'monthly'
                                                ? `Rp${formatPrice(plans.find((p) => data.plan_id === p.id)?.price_monthly || 0)}/bulan`
                                                : `Rp${formatPrice(plans.find((p) => data.plan_id === p.id)?.price_annual || 0)}/tahun (2 bln gratis)`}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {errors.plan_id && (
                        <p className="text-sm text-red-600" role="alert">
                            {errors.plan_id}
                        </p>
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
                <div className="mt-8 border-t pt-8">
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

OnboardingPlan.layout = {
    title: 'Pilih Plan',
    description:
        'Pilih plan subscription yang sesuai dengan kebutuhan bisnis Anda',
};
