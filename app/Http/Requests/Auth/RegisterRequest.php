<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'no_ektp' => ['required', 'string', 'max:20', 'unique:candidates_profiles,no_ektp'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    public function messages(): array
    {
        return [
            'no_ektp.unique' => 'Nomor E-KTP sudah terdaftar',
            'no_ektp.required' => 'Nomor E-KTP wajib diisi',
            'no_ektp.max' => 'Nomor E-KTP maksimal 20 karakter',
            'name.required' => 'Nama lengkap wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Kata sandi wajib diisi',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok',
        ];
    }
}
