<?php

namespace App\Http\Controllers;

use App\Models\Vacancies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VacanciesController extends Controller
{
    public function index()
    {
        $vacancies = Vacancies::all();

        return Inertia::render('welcome', [
            'vacancies' => $vacancies,
        ]);
    }

    public function store()
    {
        $vacancies = Vacancies::all();
        Log::info($vacancies);

        return Inertia::render('admin/jobs/jobs-management', [
            'vacancies' => $vacancies,
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
        ]);

        $user_id = Auth::user()->id;
        $job = Vacancies::create([
            'user_id' => $user_id,
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
        ]);

        return response()->json([
            'message' => 'Job created successfully',
            'job' => $job,
        ], 201);
    }

    public function update(Request $request, Vacancies $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'requirements' => 'required|array',
            'benefits' => 'nullable|array',
        ]);

        $job->update([
            'title' => $validated['title'],
            'department' => $validated['department'],
            'location' => $validated['location'],
            'requirements' => $validated['requirements'],
            'benefits' => $validated['benefits'] ?? [],
        ]);

        return response()->json([
            'message' => 'Job updated successfully',
            'job' => $job,
        ]);
    }

    public function destroy(Vacancies $job)
    {
        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    public function show($id)
    {
        $vacancy = Vacancies::findOrFail($id);
        
        return Inertia::render('DetailPekerjaan/Show', [
            'vacancy' => [
                'id' => $vacancy->id,
                'title' => 'Hardware Engineer',
                'company' => 'PT Autentik Karya Analitika',
                'description' => 'Ahli yang merancang, mengembangkan, dan menguji perangkat keras, termasuk desain PCB dan integrasi komponen elektronik, untuk aplikasi seperti robotika dan sistem tertanam.',
                'requirements' => [
                    'D3/S1 bidang Teknik Listrik, Teknik Elektro, Mekatronika, Elektromekanik, atau yang relevan',
                    'Memiliki pengetahuan tingkat lanjut terkait robotika, pemrograman tertanam, PCB layout, dan PCB desain',
                    'Tidak buta warna',
                    'Bersedia ditempatkan di Kota Semarang'
                ],
                'benefits' => [
                    'Gaji Pokok',
                    'Training',
                    'Lorem ipsum dolor sit amet'
                ]
            ]
        ]);
    }

    public function apply(Request $request, $id)
    {
        $vacancy = Vacancies::findOrFail($id);
        // Add application logic here
        
        return redirect()->back()->with('success', 'Lamaran berhasil dikirim');
    }
}
