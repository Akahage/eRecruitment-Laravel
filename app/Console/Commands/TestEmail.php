<?php

namespace App\Console\Commands;

use App\Helpers\MailHelper;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'email:test {email? : The email address to send test email to}';
    
    protected $description = 'Send a test email to verify email configuration';

    public function handle()
    {
        $email = $this->argument('email') ?? 'test@example.com';
        
        $this->info('Testing email configuration...');
        $this->info('Environment: ' . app()->environment());
        $this->info('Using: ' . (MailHelper::isUsingBrevo() ? 'Brevo' : 'Mailtrap'));
        $this->info('Host: ' . config('mail.mailers.smtp.host'));
        $this->info('Port: ' . config('mail.mailers.smtp.port'));
        
        try {
            Mail::raw('This is a test email from ' . config('app.name'), function ($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email - ' . config('app.name'))
                        ->from(MailHelper::getSenderEmail(), MailHelper::getSenderName());
            });
            
            $this->info("✅ Test email sent successfully to: {$email}");
            
            if (MailHelper::isUsingBrevo()) {
                $this->warn('📧 Using Brevo - email will be delivered to real inbox');
            } else {
                $this->warn('🔧 Using Mailtrap - check your Mailtrap inbox');
            }
            
        } catch (\Exception $e) {
            $this->error("❌ Failed to send email: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
