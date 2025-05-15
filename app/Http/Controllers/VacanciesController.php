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

    public function getVacancies()
    {
        try {
            $vacancies = Vacancies::with(['department', 'company', 'jobType'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($vacancy) {
                    return [
                        'id' => $vacancy->id,
                        'title' => $vacancy->title,
                        'company' => [
                            'name' => $vacancy->company ? $vacancy->company->name : 'N/A'
                        ],
                        'description' => $vacancy->job_description,
                        'location' => $vacancy->location,
                        'type' => $vacancy->jobType ? $vacancy->jobType->name : 'N/A',
                        'deadline' => $vacancy->deadline ? $vacancy->deadline->format('d F Y') : null,
                        'department' => $vacancy->department ? $vacancy->department->name : 'N/A'
                    ];
                });

            return Inertia::render('candidate/jobs/job-hiring', [
                'jobs' => $vacancies
            ]);
        } catch (\Exception $e) {
            Log::error('Error in VacanciesController@getVacancies: ' . $e->getMessage());
            return Inertia::render('candidate/jobs/job-hiring', [
                'jobs' => [],
                'error' => 'Failed to load job vacancies'
            ]);
        }
    }
}
