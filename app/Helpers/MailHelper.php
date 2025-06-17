<?php

namespace App\Helpers;

class MailHelper
{
    /**
     * Get mail configuration based on environment
     */
    public static function getMailConfig(): array
    {
        if (app()->environment('local', 'testing')) {
            // Development - Mailtrap
            return [
                'mailer' => 'smtp',
                'host' => env('MAILTRAP_HOST', 'sandbox.smtp.mailtrap.io'),
                'port' => env('MAILTRAP_PORT', 2525),
                'username' => env('MAILTRAP_USERNAME'),
                'password' => env('MAILTRAP_PASSWORD'),
                'encryption' => 'tls',
            ];
        } else {
            // Production - Brevo
            return [
                'mailer' => 'smtp',
                'host' => 'smtp-relay.brevo.com',
                'port' => 587,
                'username' => env('BREVO_USERNAME'),
                'password' => env('BREVO_PASSWORD'),
                'encryption' => 'tls',
            ];
        }
    }

    /**
     * Check if we're using Brevo
     */
    public static function isUsingBrevo(): bool
    {
        return !app()->environment('local', 'testing');
    }

    /**
     * Get sender email based on environment
     */
    public static function getSenderEmail(): string
    {
        return env('MAIL_FROM_ADDRESS', 'no-reply@mitrakarya.com');
    }

    /**
     * Get sender name
     */
    public static function getSenderName(): string
    {
        return env('MAIL_FROM_NAME', 'Rekrutmen Mitra Karya Group');
    }
}
