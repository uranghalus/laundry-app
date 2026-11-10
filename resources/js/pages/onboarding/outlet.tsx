import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store as submitOutlet } from '@/routes/onboarding/outlet';

/**
 * Halaman langkah outlet pertama pada wizard onboarding.
 *
 * User memasukkan nama, alamat, dan nomor WhatsApp outlet pertama; submit
 * membuat outlet milik tenant lalu lanjut ke langkah selesai.
 */
export default function OutletFirst() {
    return (
        <>
            <Head title="Outlet Pertama" />

            <p className="text-muted-foreground text-center text-sm">
                Isi data outlet pertama laundry Anda supaya transaksi nanti
                tercatat di gerai yang tepat.
            </p>

            <Form {...submitOutlet.form()} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama outlet</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoFocus
                                maxLength={120}
                                placeholder="cth. Outlet Barito"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                required
                                maxLength={500}
                                placeholder="Jl. Jenderal Sudirman No. 25"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp_number">
                                Nomor WhatsApp outlet
                            </Label>
                            <Input
                                id="whatsapp_number"
                                name="whatsapp_number"
                                type="text"
                                required
                                inputMode="tel"
                                placeholder="cth. 0812-3456-7890"
                            />
                            <InputError message={errors.whatsapp_number} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Selesaikan
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

OutletFirst.layout = {
    title: 'Outlet Pertama',
    description: 'Buat outlet pertama milik usaha laundry Anda',
};
