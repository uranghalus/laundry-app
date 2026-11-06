<?php

namespace Tests\Unit;

use App\Services\Otp\LogOtpSender;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

/**
 * Test driver OTP berbasis log: pesan terkirim dan nomor HP tersamarkan.
 */
class LogOtpSenderTest extends TestCase
{
    /**
     * Log menerima kode OTP tanpa menampilkan nomor HP secara utuh.
     */
    public function test_send_logs_masked_phone_and_code(): void
    {
        Log::spy();

        (new LogOtpSender)->send('081234567890', '123456');

        Log::shouldHaveReceived('info')->once()->withArgs(function (string $message, array $context = []): bool {
            $this->assertStringContainsString('OTP', $message);
            $this->assertSame('123456', $context['code']);
            $this->assertStringNotContainsString('081234567890', $context['phone']);
            $this->assertStringContainsString('*', $context['phone']);

            return true;
        });
    }
}
