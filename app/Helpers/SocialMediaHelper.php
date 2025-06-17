<?php

namespace App\Helpers;

class SocialMediaHelper
{    /**
     * Daftar link sosial media perusahaan
     */
    public static function getCompanySocialMedia(): array
    {
        return [
            'instagram-mikacares' => [
                'platform' => 'Instagram - MikaCares',
                'url' => 'https://instagram.com/mikacares.id',
                'icon' => 'fab fa-instagram'
            ],
            'instagram-autentik' => [
                'platform' => 'Instagram - Autentik',
                'url' => 'https://instagram.com/autentik.co.id',
                'icon' => 'fab fa-instagram'
            ],
            'linkedin-mitra' => [
                'platform' => 'LinkedIn - PT Mitra Karya Analitika',
                'url' => 'https://linkedin.com/company/pt-mitra-karya-analitika',
                'icon' => 'fab fa-linkedin-in'
            ],
            'linkedin-autentik' => [
                'platform' => 'LinkedIn - PT Autentik Karya Analitika',
                'url' => 'https://linkedin.com/company/pt-autentik-karya-analitika',
                'icon' => 'fab fa-linkedin-in'
            ],
            'youtube' => [
                'platform' => 'YouTube - MikaCares',
                'url' => 'https://youtube.com/@mikacares',
                'icon' => 'fab fa-youtube'
            ],
            'whatsapp' => [
                'platform' => 'WhatsApp',
                'url' => 'https://wa.me/6281770555554',
                'icon' => 'fab fa-whatsapp'
            ]
        ];
    }

    /**
     * Mendapatkan link berdasarkan platform
     */
    public static function getSocialMediaLink(string $platform): string
    {
        $socialMedia = self::getCompanySocialMedia();
        return $socialMedia[$platform]['url'] ?? '#';
    }

    /**
     * Mendapatkan semua platform yang tersedia
     */
    public static function getAvailablePlatforms(): array
    {
        return array_keys(self::getCompanySocialMedia());
    }

    /**
     * Format untuk template Blade
     */
    public static function getFormattedForBlade(): array
    {
        $socialMedia = self::getCompanySocialMedia();
        $formatted = [];
        
        foreach ($socialMedia as $platform => $data) {
            $formatted[] = (object) [
                'platform_name' => $data['platform'],
                'url' => $data['url'],
                'icon' => $data['icon']
            ];
        }
        
        return $formatted;
    }
}
