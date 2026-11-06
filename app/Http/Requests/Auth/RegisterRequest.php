<?php

namespace App\Http\Requests\Auth;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request untuk registrasi akun owner baru.
 *
 * Hanya memvalidasi data akun. Data bisnis dan outlet diisi pada langkah
 * onboarding setelah nomor HP terverifikasi.
 */
class RegisterRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi data akun.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'phone' => ['required', 'string', 'max:20', 'regex:/^(\+62|62|0)8[1-9][0-9]{7,10}$/'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * Pesan validasi khusus.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Nomor HP harus berformat Indonesia (contoh: 081234567890 atau 6281234567890)',
        ];
    }
}
