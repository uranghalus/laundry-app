import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

/**
 * Switcher tema untuk navigasi halaman publik.
 *
 * Reuse `useAppearance()` agar state bersama dengan `/settings/appearance`
 * (modul-level store + cookie, bukan `useState`), sehingga tema yang dipilih di
 * header tetap berlaku setelah masuk ke aplikasi dan tidak berkedip saat
 * Inertia melakukan navigasi.
 *
 * Dipakai `DropdownMenu` (bukan segmented control `appearance-tabs`) supaya
 * header tetap ringkas dan ketiga mode — termasuk `system` — tetap tersedia.
 */
export default function MarketingThemeSwitcher({
    className = '',
}: {
    className?: string;
}) {
    const { appearance, updateAppearance } = useAppearance();

    const options: {
        value: Appearance;
        label: string;
        icon: typeof Sun;
        hint: string;
    }[] = [
        {
            value: 'light',
            label: 'Terang',
            icon: Sun,
            hint: 'Selalu tampil terang',
        },
        {
            value: 'dark',
            label: 'Gelap',
            icon: Moon,
            hint: 'Selalu tampil gelap',
        },
        {
            value: 'system',
            label: 'Sistem',
            icon: Monitor,
            hint: 'Ikuti pengaturan perangkat',
        },
    ];

    const active = options.find((option) => option.value === appearance);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label={`Tema: ${active?.label ?? 'Sistem'}`}
                    className={cn(
                        'text-muted-foreground hover:text-foreground size-9',
                        className,
                    )}
                    size="icon"
                    variant="ghost"
                >
                    {active ? (
                        <active.icon className="size-4" />
                    ) : (
                        <Monitor className="size-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-medium">
                    Tema tampilan
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    onValueChange={(value) =>
                        updateAppearance(value as Appearance)
                    }
                    value={appearance}
                >
                    {options.map(({ value, label, icon: Icon, hint }) => (
                        <DropdownMenuRadioItem
                            className="items-start gap-2"
                            key={value}
                            value={value}
                        >
                            <Icon className="mt-0.5 size-4 shrink-0" />
                            <span className="flex flex-col">
                                <span>{label}</span>
                                <span className="text-muted-foreground text-xs">
                                    {hint}
                                </span>
                            </span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
