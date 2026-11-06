<?php

namespace Tests\Feature\Otp;

use App\Contracts\OtpSender;
use App\Enums\OtpPurpose;
use App\Models\OtpCode;
use App\Services\Otp\OtpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Test perilaku OtpService: penerbitan, cooldown, dan verifikasi kode.
 */
class OtpServiceTest extends TestCase
{
    use RefreshDatabase;

    private const PHONE = '081234567890';

    /**
     * Kode disimpan sebagai hash dan tidak pernah sebagai plaintext.
     */
    public function test_code_is_stored_as_hash_not_plaintext(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);

        $service->issue(self::PHONE, OtpPurpose::Register);

        $code = $sender->sent[0]['code'];
        $otp = OtpCode::sole();

        $this->assertNotSame($code, $otp->code_hash);
        $this->assertTrue(Hash::check($code, $otp->code_hash));
    }

    /**
     * OtpSender menerima nomor HP dan kode saat issue.
     */
    public function test_sender_is_called_when_issuing_code(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);

        $service->issue(self::PHONE, OtpPurpose::Register);

        $this->assertCount(1, $sender->sent);
        $this->assertSame(self::PHONE, $sender->sent[0]['phone']);
        $this->assertMatchesRegularExpression('/^\d{6}$/', $sender->sent[0]['code']);
    }

    /**
     * Kode benar mengembalikan true dan menandai kode sudah dipakai.
     */
    public function test_correct_code_returns_true_and_marks_consumed(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);

        $result = $service->verify(self::PHONE, $sender->sent[0]['code'], OtpPurpose::Register);

        $this->assertTrue($result);
        $this->assertNotNull(OtpCode::sole()->consumed_at);
    }

    /**
     * Kode salah mengembalikan false dan menambah jumlah percobaan.
     */
    public function test_wrong_code_returns_false_and_increments_attempts(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);

        $result = $service->verify(self::PHONE, $this->wrongCode($sender->sent[0]['code']), OtpPurpose::Register);

        $this->assertFalse($result);
        $this->assertSame(1, OtpCode::sole()->attempts);
        $this->assertNull(OtpCode::sole()->consumed_at);
    }

    /**
     * Setelah lima percobaan gagal, kode benar pun ditolak.
     */
    public function test_code_fails_after_max_attempts_even_when_correct(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);

        $code = $sender->sent[0]['code'];
        $wrongCode = $this->wrongCode($code);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->assertFalse($service->verify(self::PHONE, $wrongCode, OtpPurpose::Register));
        }

        $this->assertSame(5, OtpCode::sole()->attempts);
        $this->assertFalse($service->verify(self::PHONE, $code, OtpPurpose::Register));
        $this->assertNull(OtpCode::sole()->consumed_at);
    }

    /**
     * Kode yang sudah kedaluwarsa selalu ditolak.
     */
    public function test_expired_code_returns_false(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);

        $this->travel(301)->seconds();

        $this->assertFalse($service->verify(self::PHONE, $sender->sent[0]['code'], OtpPurpose::Register));
    }

    /**
     * Permintaan ulang dalam masa cooldown ditolak dengan pesan untuk user.
     */
    public function test_resend_within_cooldown_is_rejected_with_user_facing_message(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);

        try {
            $service->issue(self::PHONE, OtpPurpose::Register);
            $this->fail('Permintaan ulang dalam cooldown seharusnya ditolak.');
        } catch (ValidationException $exception) {
            $this->assertStringContainsString('detik', $exception->errors()['phone'][0]);
        }

        $this->assertCount(1, $sender->sent);
    }

    /**
     * Issue baru membatalkan kode lama sehingga hanya kode terbaru berlaku.
     */
    public function test_new_issue_consumes_previous_code(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);
        $oldCode = $sender->sent[0]['code'];

        $this->travel(61)->seconds();
        $service->issue(self::PHONE, OtpPurpose::Register);

        $this->assertSame(1, OtpCode::query()->whereNotNull('consumed_at')->count());
        $this->assertFalse($service->verify(self::PHONE, $oldCode, OtpPurpose::Register));
        $this->assertTrue($service->verify(self::PHONE, $sender->sent[1]['code'], OtpPurpose::Register));
    }

    /**
     * Kode untuk purpose Register tidak berlaku untuk purpose OutletWa.
     */
    public function test_code_for_register_purpose_is_not_valid_for_outlet_wa(): void
    {
        $sender = new RecordingOtpSender;
        $service = new OtpService($sender);
        $service->issue(self::PHONE, OtpPurpose::Register);

        $result = $service->verify(self::PHONE, $sender->sent[0]['code'], OtpPurpose::OutletWa);

        $this->assertFalse($result);
        $this->assertNull(OtpCode::sole()->consumed_at);
    }

    /**
     * Membuat kode enam digit yang dijamin berbeda dari kode asli.
     */
    private function wrongCode(string $code): string
    {
        return $code === '000000' ? '111111' : '000000';
    }
}

/**
 * Test double OtpSender yang mencatat semua kode terkirim.
 */
final class RecordingOtpSender implements OtpSender
{
    /** @var list<array{phone: string, code: string}> */
    public array $sent = [];

    /**
     * Mencatat kode yang seharusnya dikirim ke nomor HP.
     */
    public function send(string $phone, string $code): void
    {
        $this->sent[] = ['phone' => $phone, 'code' => $code];
    }
}
