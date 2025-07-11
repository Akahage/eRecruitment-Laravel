<?php

namespace App\Http\Controllers;

use App\Models\QuestionPacks;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function store()
    {
        $questionPacks = QuestionPacks::withCount('questions')->get();

        return Inertia::render('admin/questions/question-management', [
            'tests' => $questionPacks,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('admin/questions/add-questions');
    }

    public function edit(QuestionPacks $questionPack)
    {
        $questionPack->load('questions');
        Log::info('Question pack questions: '.$questionPack->questions);

        return Inertia::render('admin/questions/edit-questions', [
            'assessment' => $questionPack,
        ]);
    }

    public function update(Request $request, QuestionPacks $questionPack)
    {
        try {
            DB::beginTransaction();

            $questionPack->update([
                'pack_name' => $request->title,
                'description' => $request->description,
                'test_type' => $request->test_type,
                'duration' => $request->duration,
            ]);

            $questions = json_decode($request->questions, true);

            // Detach all questions from this question pack
            $questionPack->questions()->detach();

            foreach ($questions as $questionData) {
                if (! empty($questionData['options'])) {
                    $question = Question::create([
                        'question_text' => $questionData['question_text'],
                        'options' => $questionData['options'],
                    ]);

                    // Attach the question to the question pack
                    $questionPack->questions()->attach($question->id);
                }
            }

            DB::commit();

            return redirect()->route('admin.questions.info')
                ->with('success', 'Question pack updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Update failed: '.$e->getMessage());

            return back()->with('error', 'Failed to update question pack');
        }
    }

    public function index()
    {
        $questionPacks = QuestionPacks::withCount('questions')->get();

        return Inertia::render('admin/questions/question-management', [
            'tests' => $questionPacks,
        ]);
    }
}
