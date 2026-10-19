<?php

namespace App\Http\Requests\Auth;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request untuk registrasi tenant baru
 * Validasi: nama, email, password, nomor HP, tipe bisnis
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
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:20', 'regex:/^(\+62|62|0)8[1-9][0-9]{7,10}$/'],
            'business_type' => ['required', Rule::in(['single', 'multi'])],
            'outlet_name' => ['required', 'string', 'max:255'],
            'outlet_address' => ['required', 'string'],
            'outlet_whatsapp_number' => ['required', 'string', 'max:20', 'regex:/^(\+62|62|0)8[1-9][0-9]{7,10}$/'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Nomor HP harus berformat Indonesia (contoh: 081234567890 atau 6281234567890)',
            'outlet_whatsapp_number.regex' => 'Nomor WhatsApp outlet harus berformat Indonesia',
            'business_type.in' => 'Tipe bisnis harus single atau multi',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
        ];
    }
}
