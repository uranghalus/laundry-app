import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { store as submitBusinessType } from '@/routes/onboarding/business';

/**
 * Halaman langkah tipe bisnis pada wizard onboarding.
 *
 * User memasukkan nama usaha dan memilih tipe bisnis (satu atau banyak
 * outlet); submit membuat tenant berstatus trial dan lanjut ke langkah
 * outlet.
 */
export default function BusinessType() {
    return (
        <>
            <Head title="Tipe Bisnis" />

            <p className="text-muted-foreground text-center text-sm">
                Beri nama usaha laundry Anda dan pilih tipe bisnisnya supaya
                tenant bisa disiapkan.
            </p>

            <Form
                {...submitBusinessType.form()}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="business_name">Nama usaha</Label>
                            <Input
                                id="business_name"
                                name="business_name"
                                type="text"
                                required
                                autoFocus
                                maxLength={120}
                                placeholder="cth. Laundry Bersih Jaya"
                            />
                            <InputError message={errors.business_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="business_type">Tipe bisnis</Label>
                            <Select name="business_type">
                                <SelectTrigger
                                    id="business_type"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Pilih tipe bisnis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">
                                        Satu outlet
                                    </SelectItem>
                                    <SelectItem value="multi">
                                        Banyak outlet
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.business_type} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Lanjutkan
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

BusinessType.layout = {
    title: 'Tipe Bisnis',
    description: 'Beri nama usaha dan pilih tipe bisnis Anda',
};
