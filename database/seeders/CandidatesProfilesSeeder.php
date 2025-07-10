<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CandidatesProfiles;
use Carbon\Carbon;
use App\Enums\UserRole;
use Faker\Factory as Faker;

class CandidatesProfilesSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        foreach ($candidates as $user) {
            CandidatesProfiles::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'no_ektp' => $faker->numerify('################'), // Generate 16 digit number
                    'gender' => $faker->randomElement(['male', 'female']),
                    'phone_number' => '08' . $faker->numerify('#########'),
                    'npwp' => $faker->boolean(70) ? $faker->numerify('##############') : null,
                    'about_me' => 'Saya seorang kandidat yang berdedikasi.',
                    'place_of_birth' => $faker->city,
                    'date_of_birth' => $faker->dateTimeBetween('-30 years', '-20 years')->format('Y-m-d'),
                    'address' => $faker->streetAddress,
                    'province' => 'DKI Jakarta',
                    'city' => 'Jakarta Selatan',
                    'district' => 'Kebayoran Baru',
                    'village' => 'Gandaria Utara',
                    'rt' => str_pad($faker->numberBetween(1, 20), 3, '0', STR_PAD_LEFT),
                    'rw' => str_pad($faker->numberBetween(1, 10), 3, '0', STR_PAD_LEFT),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
