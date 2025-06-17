import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

interface Question {
    id: number;
    question: string;
    options: string[];
}

interface TestInfo {
    title: string;
    type: string;
    duration: number; // in minutes
    totalQuestions: number;
    instructions: string;
}

type PageProps = InertiaPageProps & {
    questions: Question[];
    testInfo: TestInfo;
    userAnswers?: Record<number, string>;
};

export default function CandidatePsychotest() {
    const { questions = [], testInfo, userAnswers: initialUserAnswers = {} } = usePage<PageProps>().props;
    
    // State management
    const [currentPhase, setCurrentPhase] = useState<'start' | 'test' | 'complete'>('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>(initialUserAnswers);
    const [timeLeft, setTimeLeft] = useState(0);
    const [testStarted, setTestStarted] = useState(false);

    // Timer effect
    useEffect(() => {
        if (testStarted && timeLeft > 0 && currentPhase === 'test') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && testStarted && currentPhase === 'test') {
            handleCompleteTest();
        }
    }, [timeLeft, testStarted, currentPhase]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartTest = () => {
        setTestStarted(true);
        setTimeLeft((testInfo?.duration || 60) * 60); // Convert minutes to seconds
        setCurrentPhase('test');
    };

    const handleAnswerChange = (answer: string) => {
        const questionId = questions[currentQuestion]?.id;
        if (questionId) {
            setUserAnswers(prev => ({
                ...prev,
                [questionId]: answer
            }));
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestion(index);
    };

    const handleCompleteTest = () => {
        setCurrentPhase('complete');
        // Submit answers to backend
        router.post('/candidate/psychotest/submit', {
            answers: userAnswers
        });
    };

    const handleBackToDashboard = () => {
        router.visit('/candidate');
    };

    const getQuestionStatus = (index: number) => {
        const questionId = questions[index]?.id;
        return userAnswers[questionId] ? 'answered' : 'unanswered';
    };

    const getAnsweredCount = () => {
        return Object.keys(userAnswers).length;
    };

    const getUnansweredCount = () => {
        return questions.length - getAnsweredCount();
    };

    // Phase 1: Start Screen
    if (currentPhase === 'start') {
        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-white relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center py-4">
                            {/* Logo dihilangkan */}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl ml-0 md:ml-40 px-6 py-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tes Psikotes</h2>
                        <p className="text-gray-600 mb-12 leading-relaxed text-justify">
                            Tes ini di rancang untuk membantu Anda untuk memahami kepribadian Anda lebih dalam. Hasil tes ini akan memberikan wawasan tentang kekuatan, kelemahan, dan preferensi Anda dalam berbagai situasi.
                        </p>

                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Tes</h3>
                            <div className="space-y-4">
                                <div className="flex">
                                    <span className="w-32 text-gray-700 font-medium">Tipe</span>
                                    <span className="text-gray-900 font-medium">{testInfo?.type || 'Logic'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 text-gray-700 font-medium">Durasi</span>
                                    <span className="text-gray-900 font-medium">{testInfo?.duration || 60} menit</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 text-gray-700 font-medium">Jumlah Soal</span>
                                    <span className="text-gray-900 font-medium">{testInfo?.totalQuestions || questions.length} Soal</span>
                                </div>
                                <div className="flex">
                                    <span className="w-32 text-gray-700 font-medium">Intruksi</span>
                                    <span className="text-gray-900 font-medium text-justify">
                                        {testInfo?.instructions || 'Pilih jawaban yang paling sesuai dengan diri Anda. Tidak ada jawaban benar atau salah. Jawablah dengan jujur dan spontan.'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartTest}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded font-medium transition-colors text-sm"
                        >
                            Mulai Tes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Phase 2: Test Screen
    if (currentPhase === 'test' && questions.length > 0) {
        const currentQuestionData = questions[currentQuestion];
        const currentAnswer = currentQuestionData ? userAnswers[currentQuestionData.id] : '';

        return (
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center py-4">
                            {/* Logo dihilangkan */}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl w-full mx-auto px-4 py-8 flex gap-4 justify-center">
                    {/* Main Question Area */}
                    <div className="flex-1 max-w-3xl">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                            {/* Question Header */}
                            <div className="bg-blue-500 text-white px-8 py-5 rounded-t-lg">
                                <h3 className="text-lg font-bold">Soal {currentQuestion + 1} dari {questions.length}</h3>
                            </div>
                            {/* Question Content */}
                            <div className="px-4 py-6">
                                <p className="text-gray-900 mb-6 text-lg leading-relaxed">
                                    {currentQuestionData?.question}
                                </p>
                                {/* Answer Options */}
                                <div className="space-y-3">
                                    {currentQuestionData?.options.map((option, index) => (
                                        <label
                                            key={index}
                                            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                                                currentAnswer === option 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestionData.id}`}
                                                value={option}
                                                checked={currentAnswer === option}
                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                className="mt-1 mr-3 text-blue-500 w-5 h-5"
                                            />
                                            <span className="text-gray-900 text-base leading-relaxed">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Navigation */}
                            <div className="flex justify-between items-center px-8 py-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="text-base text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2"
                                >
                                    Sebelumnya
                                </button>
                                <button className="text-base text-gray-600 hover:text-gray-800 flex items-center px-5 py-2">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                    </svg>
                                    Tandai Soal
                                </button>
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={currentQuestion === questions.length - 1}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded text-base font-bold transition-colors"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Question Navigator Sidebar */}
                    <div className="w-96">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                            {/* Question Grid */}
                            <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-8 justify-items-center">
                                {questions.map((_, index) => {
                                    const status = getQuestionStatus(index);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => goToQuestion(index)}
                                            className={`w-14 h-14 rounded text-lg font-bold border-2 transition-colors ${
                                                status === 'answered'
                                                    ? 'bg-green-500 text-white border-green-500'
                                                    : index === currentQuestion
                                                    ? 'bg-orange-400 text-white border-orange-400'
                                                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Legend */}
                            <div className="space-y-4 mb-8 text-base">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 bg-green-500 rounded mr-3"></div>
                                    <span className="text-gray-700">Dijawab</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 bg-orange-400 rounded mr-3"></div>
                                    <span className="text-gray-700">Ditandai</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-5 h-5 bg-gray-100 border border-gray-300 rounded mr-3"></div>
                                    <span className="text-gray-700">Belum Dijawab</span>
                                </div>
                            </div>
                            {/* Status Summary */}
                            <div className="border-t border-gray-200 pt-8 bg-gray-50 rounded p-6 -mx-2 mt-4">
                                <h4 className="font-bold text-gray-900 mb-4 text-center text-lg">Status Pengerjaan</h4>
                                <div className="space-y-3 text-base">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Dijawab :</span>
                                        <span className="font-bold text-gray-900">{getAnsweredCount()} dari {questions.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Ditandai :</span>
                                        <span className="font-bold text-gray-900">1</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Belum Dijawab :</span>
                                        <span className="font-bold text-gray-900">{getUnansweredCount()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCompleteTest}
                                    className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded font-bold text-lg transition-colors"
                                >
                                    Akhiri Tes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Phase 3: Completion Screen
    if (currentPhase === 'complete') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Terima kasih telah menyelesaikan tes!</h2>
                    <p className="text-gray-600 mb-16 text-sm">
                        Kami menghargai waktu dan usaha Anda dalam menyelesaikan tes ini. Hasil tes Anda akan segera di proses.
                    </p>
                    <div className="w-full max-w-2xl mb-16" style={{ textAlign: 'left', marginLeft: 0 }}>
                        <h3 className="text-xl font-bold text-gray-900 mb-8">Langkah selanjutnya</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Analisis Hasil</h4>
                                <p className="text-gray-600">Hasil tes Anda akan di analisis oleh tim ahli kami.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Notifikasi Email</h4>
                                <p className="text-gray-600">Anda akan menerima notifikasi melalui email setelah hasil tes siap.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Lihat Hasil di Riwayat Lamaran</h4>
                                <p className="text-gray-600">Anda dapat melihat hasil tes lengkap di riwayat lamaran.</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded font-medium transition-colors text-sm"
                    >
                        Kembali ke Dasbor
                    </button>
                </div>
            </div>
        );
    }
    
    // Loading or error state
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat tes...</p>
            </div>
        </div>
    );
}
