<?php

namespace Database\Seeders;

use App\Enums\CandidatesStage;
use App\Models\Applications;
use App\Models\ApplicationHistory;
use App\Models\Statuses;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ApplicationHistorySeeder extends Seeder
{
    public function run(): void
    {
        // Check if data already exists
        if (ApplicationHistory::count() > 0) {
            $this->command->info('Application history data already exists. Skipping seeder.');
            return;
        }

        // Get necessary data
        $applications = Applications::all();
        $admins = User::whereIn('role', ['super_admin', 'hr', 'head_hr'])->get();

        $this->command->info('Mencari status di database...');

        // Dapatkan semua status berdasarkan enum CandidatesStage
        $adminStatus = Statuses::where('stage', CandidatesStage::ADMINISTRATIVE_SELECTION->value)->first();
        $psychoTestStatus = Statuses::where('stage', CandidatesStage::PSYCHOTEST->value)->first();
        $interviewStatus = Statuses::where('stage', CandidatesStage::INTERVIEW->value)->first();
        $acceptedStatus = Statuses::where('stage', CandidatesStage::ACCEPTED->value)->first();
        $rejectedStatus = Statuses::where('stage', CandidatesStage::REJECTED->value)->first();

        // Debugging info
        $this->command->info("Status yang ditemukan:");
        $this->command->info("- Admin: " . ($adminStatus ? $adminStatus->name : 'TIDAK DITEMUKAN'));
        $this->command->info("- Psiko: " . ($psychoTestStatus ? $psychoTestStatus->name : 'TIDAK DITEMUKAN'));
        $this->command->info("- Interview: " . ($interviewStatus ? $interviewStatus->name : 'TIDAK DITEMUKAN'));
        $this->command->info("- Accepted: " . ($acceptedStatus ? $acceptedStatus->name : 'TIDAK DITEMUKAN'));
        $this->command->info("- Rejected: " . ($rejectedStatus ? $rejectedStatus->name : 'TIDAK DITEMUKAN'));

        // Validasi status yang dibutuhkan
        if (!$adminStatus || !$psychoTestStatus || !$interviewStatus || !$acceptedStatus || !$rejectedStatus) {
            $this->command->error('Beberapa status tidak ditemukan. Jalankan migrasi statuses_table terlebih dahulu.');
            return;
        }

        if ($applications->isEmpty()) {
            $this->command->error('No applications found. Please run ApplicationsSeeder first.');
            return;
        }

        if ($admins->isEmpty()) {
            $this->command->error('No admin users found. Please run SuperAdminSeeder first.');
            return;
        }

        // Mendapatkan aplikasi milik user 1 dan 2
        $specialApplications = Applications::whereIn('user_id', [1, 2])->get();

        if ($specialApplications->isEmpty()) {
            $this->command->warn('Tidak menemukan aplikasi untuk user 1 dan 2. Pastikan data aplikasi sudah dibuat.');
        } else {
            $this->command->info('Ditemukan ' . $specialApplications->count() . ' aplikasi untuk user 1 dan 2.');
        }

        // Proses khusus untuk user 1 dan 2
        foreach ($specialApplications as $application) {
            $startDate = Carbon::now()->subDays(7); // 1 minggu yang lalu
            $admin = $admins->first(); // Gunakan admin pertama untuk konsistensi

            if ($application->user_id === 1) {
                // USER 1: Baru sampai tahap psikotes yang belum dikerjakan
                
                // 1. Tahap Administrasi (selesai, tidak aktif)
                $adminDate = $startDate->copy();
                $this->createStageHistory(
                    $application,
                    $adminStatus,
                    $admin,
                    $adminDate,
                    85, // Score baik
                    'Dokumen lengkap dan sesuai persyaratan. Kandidat lolos tahap administrasi.',
                    false // Sudah tidak aktif karena sudah lanjut ke tahap berikutnya
                );
                
                // 2. Tahap Psikotes (aktif, belum dikerjakan)
                $psychoDate = Carbon::now(); // Jadwal untuk hari ini
                $this->createStageHistory(
                    $application,
                    $psychoTestStatus,
                    $admin,
                    null, // processed_at null karena belum dikerjakan
                    null, // Score masih null
                    'Kandidat diundang untuk mengikuti tes psikologi.',
                    true, // Aktif karena ini tahap saat ini
                    $psychoDate, // Scheduled untuk hari ini
                    null // Belum completed
                );
                
                // Update status aplikasi user 1 ke psychotest
                $application->status_id = $psychoTestStatus->id;
                $application->save();
                
                $this->command->info('User 1 sekarang berada di tahap psikotes yang belum dikerjakan.');
            } else {
                // USER 2: Sampai tahap rejected
                $this->processUser2Application($application, $admin, $adminStatus, $psychoTestStatus, $interviewStatus, $rejectedStatus);
            }
        }

        // Proses aplikasi lainnya secara acak
        $otherApplications = $applications->whereNotIn('id', $specialApplications->pluck('id'));
        $this->processOtherApplications($otherApplications, $admins, $adminStatus, $psychoTestStatus, $interviewStatus, $acceptedStatus, $rejectedStatus);

        $this->command->info('Application history seeded successfully!');
    }

    private function processUser2Application($application, $admin, $adminStatus, $psychoTestStatus, $interviewStatus, $rejectedStatus)
    {
        $startDate = Carbon::now()->subDays(30); // 1 bulan yang lalu
        
        // 1. Tahap Administrasi
        $adminDate = $startDate->copy();
        $this->createStageHistory(
            $application,
            $adminStatus,
            $admin,
            $adminDate,
            80,
            $this->getAdminNotes(80),
            false
        );
        
        // 2. Tahap Psikotes
        $psychoDate = $adminDate->copy()->addDays(7);
        $this->createStageHistory(
            $application,
            $psychoTestStatus,
            $admin,
            $psychoDate,
            75,
            $this->getTestNotes(75),
            false
        );
        
        // 3. Tahap Interview
        $interviewDate = $psychoDate->copy()->addDays(7);
        $this->createStageHistory(
            $application,
            $interviewStatus,
            $admin,
            $interviewDate,
            60,
            $this->getInterviewNotes(60),
            false
        );
        
        // 4. Tahap Rejected
        $rejectDate = $interviewDate->copy()->addDays(3);
        $this->createStageHistory(
            $application,
            $rejectedStatus,
            $admin,
            $rejectDate,
            60,
            "Setelah pertimbangan menyeluruh, perusahaan memilih kandidat lain yang lebih sesuai dengan kebutuhan posisi.",
            true
        );
        
        // Update status aplikasi user 2 ke rejected
        $application->status_id = $rejectedStatus->id;
        $application->save();
        
        $this->command->info('User 2 telah menyelesaikan proses rekrutmen dan statusnya Rejected.');
    }
    
    private function processOtherApplications($applications, $admins, $adminStatus, $psychoTestStatus, $interviewStatus, $acceptedStatus, $rejectedStatus)
    {
        $this->command->info('Memproses ' . $applications->count() . ' aplikasi lainnya secara acak.');

        foreach ($applications as $application) {
            $appliedAt = Carbon::now()->subDays(rand(30, 60));
            $admin = $admins->random();
            
            // Distribute stages realistically
            $stageDistribution = rand(1, 100);
            
            if ($stageDistribution <= 35) {
                // 35% - Still in administrative review
                $currentStatus = $adminStatus;
                $score = rand(60, 85);
            } elseif ($stageDistribution <= 55) {
                // 20% - Moved to psychological test
                $currentStatus = $psychoTestStatus;
                $score = rand(65, 90);
            } elseif ($stageDistribution <= 70) {
                // 15% - Moved to interview
                $currentStatus = $interviewStatus;
                $score = rand(70, 90);
            } else {
                // 30% - Accepted or Rejected
                $currentStatus = rand(0, 1) ? $acceptedStatus : $rejectedStatus;
                $score = $currentStatus->id == $rejectedStatus->id ? rand(30, 65) : rand(80, 95);
            }

            // Create histories for each stage up to current status
            $this->createRandomApplicationHistory(
                $application,
                $admin,
                $appliedAt,
                $currentStatus,
                $adminStatus,
                $psychoTestStatus,
                $interviewStatus,
                $acceptedStatus,
                $rejectedStatus
            );
            
            // Update application status
            $application->status_id = $currentStatus->id;
            $application->save();
        }
    }

    private function createRandomApplicationHistory(
        $application,
        $admin,
        $startDate,
        $currentStatus,
        $adminStatus,
        $psychoTestStatus,
        $interviewStatus,
        $acceptedStatus,
        $rejectedStatus
    ) {
        // 1. Admin stage for all applications
        $adminDate = $startDate->copy();
        $this->createStageHistory(
            $application,
            $adminStatus,
            $admin,
            $adminDate,
            rand(60, 90),
            $this->getAdminNotes(rand(60, 90)),
            $currentStatus->id === $adminStatus->id // Only active if this is the current stage
        );

        // Stop if current status is admin
        if ($currentStatus->id === $adminStatus->id) return;

        // 2. Psychotest stage
        $psychoDate = $adminDate->copy()->addDays(rand(5, 10));
        $this->createStageHistory(
            $application,
            $psychoTestStatus,
            $admin,
            $psychoDate,
            rand(60, 90),
            $this->getTestNotes(rand(60, 90)),
            $currentStatus->id === $psychoTestStatus->id // Only active if this is the current stage
        );

        // Stop if current status is psychotest
        if ($currentStatus->id === $psychoTestStatus->id) return;

        // 3. Interview stage
        $interviewDate = $psychoDate->copy()->addDays(rand(5, 10));
        $this->createStageHistory(
            $application,
            $interviewStatus,
            $admin,
            $interviewDate,
            rand(60, 90),
            $this->getInterviewNotes(rand(60, 90)),
            $currentStatus->id === $interviewStatus->id // Only active if this is the current stage
        );

        // Stop if current status is interview
        if ($currentStatus->id === $interviewStatus->id) return;

        // 4. Final stage (accepted/rejected)
        $finalDate = $interviewDate->copy()->addDays(rand(3, 7));
        if ($currentStatus->id === $acceptedStatus->id) {
            $this->createStageHistory(
                $application,
                $acceptedStatus,
                $admin,
                $finalDate,
                rand(80, 95),
                "Kandidat diterima untuk bergabung dengan perusahaan",
                true // This is active
            );
        } else if ($currentStatus->id === $rejectedStatus->id) {
            $this->createStageHistory(
                $application,
                $rejectedStatus,
                $admin,
                $finalDate,
                rand(30, 65),
                "Kandidat tidak memenuhi kriteria yang dibutuhkan: " . $this->getRejectionReason(),
                true // This is active
            );
        }
    }

    private function createStageHistory(
        $application, 
        $status, 
        $admin, 
        $processedAt, 
        $score, 
        $notes, 
        $isActive = true,
        $scheduledAt = null,
        $completedAt = null
    ) {
        // Validasi parameter untuk menghindari null reference
        if (!$application || !$status || !$admin) {
            $this->command->error('Invalid parameters for createStageHistory:');
            $this->command->error('- Application: ' . ($application ? 'OK' : 'NULL'));
            $this->command->error('- Status: ' . ($status ? 'OK' : 'NULL'));
            $this->command->error('- Admin: ' . ($admin ? 'OK' : 'NULL'));
            return;
        }

        try {
            // If this is going to be the active stage, deactivate all other stages for this application
            if ($isActive) {
                ApplicationHistory::where('application_id', $application->id)
                    ->update(['is_active' => false]);
            }
            
            // Setup scheduled_at dan completed_at dengan pengecekan null
            if ($scheduledAt === null && $processedAt !== null) {
                $scheduledAt = $processedAt->copy()->subDays(rand(1, 3));
            }
            
            if ($completedAt === null && $processedAt !== null) {
                $completedAt = $processedAt;
            }

            // Create the history record dengan pengecekan null yang lebih lengkap
            ApplicationHistory::create([
                'application_id' => $application->id,
                'status_id' => $status->id,
                'processed_at' => $processedAt,
                'score' => $score,
                'notes' => $notes,
                'scheduled_at' => $scheduledAt,
                'completed_at' => $completedAt,
                'reviewed_by' => $admin->id,
                'reviewed_at' => $processedAt ? $processedAt->copy()->addHours(rand(1, 24)) : null,
                'is_active' => $isActive
            ]);
        } catch (\Exception $e) {
            $this->command->error('Error creating history: ' . $e->getMessage());
            $this->command->error('Error trace: ' . $e->getTraceAsString());
        }
    }

    private function getAdminNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Dokumen lengkap dan sesuai persyaratan. Latar belakang pendidikan sangat relevan.',
                'Kualifikasi sangat baik. Pengalaman kerja sesuai dengan posisi yang dilamar.',
                'CV terstruktur dengan baik. Pengalaman dan skill sangat menarik.'
            ]);
        } elseif ($score >= 70) {
            return fake()->randomElement([
                'Kualifikasi cukup baik. Beberapa pengalaman relevan dengan posisi.',
                'Dokumen lengkap. Perlu explorasi lebih lanjut mengenai technical skills.',
                'Background pendidikan sesuai. Pengalaman kerja masih terbatas.'
            ]);
        } else {
            return fake()->randomElement([
                'Kualifikasi tidak memenuhi minimum requirement untuk posisi ini.',
                'Dokumen tidak lengkap dan pengalaman tidak relevan.',
                'Background pendidikan tidak sesuai dengan job specification.'
            ]);
        }
    }

    private function getTestNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Hasil psikotes sangat baik. Skor IQ dan kepribadian sesuai dengan posisi.',
                'Kemampuan logika dan analisis excellent. Personality type cocok dengan team.',
                'Test results menunjukkan kandidat memiliki potensi yang baik.'
            ]);
        } elseif ($score >= 70) {
            return fake()->randomElement([
                'Hasil psikotes cukup baik. Beberapa area masih perlu improvement.',
                'Skor IQ dalam range normal. Personality assessment menunjukkan hasil positif.',
                'Test results acceptable. Cocok untuk posisi entry to mid level.'
            ]);
        } else {
            return fake()->randomElement([
                'Hasil psikotes tidak memenuhi standar minimum perusahaan.',
                'Skor IQ dan personality assessment di bawah cut-off point.',
                'Test performance sangat mengecewakan. Tidak cocok untuk posisi ini.'
            ]);
        }
    }

    private function getInterviewNotes($score)
    {
        if ($score >= 85) {
            return fake()->randomElement([
                'Wawancara menunjukkan performa yang sangat baik. Komunikasi dan pengetahuan mendalam.',
                'Kandidat menunjukkan sikap yang sangat positif dan profesional selama wawancara.',
                'Kemampuan menjawab pertanyaan dengan tepat dan percaya diri.'
            ]);
        } elseif ($score >= 70) {
            return fake()->randomElement([
                'Wawancara berjalan dengan baik. Beberapa jawaban memerlukan klarifikasi lebih lanjut.',
                'Kandidat menunjukkan potensi, namun masih perlu pengembangan di beberapa area.',
                'Komunikasi baik, tetapi perlu peningkatan dalam beberapa aspek teknis.'
            ]);
        } else {
            return fake()->randomElement([
                'Wawancara tidak memuaskan. Banyak pertanyaan yang dijawab tidak relevan.',
                'Kandidat tidak menunjukkan minat atau pengetahuan yang cukup tentang posisi ini.',
                'Perlu banyak perbaikan dalam hal komunikasi dan pemahaman materi.'
            ]);
        }
    }

    private function getRejectionReason()
    {
        return fake()->randomElement([
            'Tidak memenuhi kualifikasi minimum yang dibutuhkan.',
            'Kurangnya pengalaman yang relevan dengan posisi.',
            'Hasil tes psikologi tidak sesuai dengan karakter yang dibutuhkan.',
            'Kandidat menunjukkan performa yang kurang baik dalam wawancara.',
            'Ekspektasi gaji lebih tinggi dari anggaran yang tersedia.',
            'Kandidat lain memiliki kualifikasi yang lebih baik.',
            'Hasil background check tidak memenuhi standar perusahaan.'
        ]);
    }
}
