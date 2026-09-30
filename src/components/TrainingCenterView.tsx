import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  FileText
} from 'lucide-react';
import { TrainingCourse, TrainingLesson, QuizQuestion, TaxYear } from '../types';

interface TrainingCenterViewProps {
  courses: TrainingCourse[];
  currentTaxYear: TaxYear;
  onNavigateToScenarioLab: () => void;
  onGenerateTraining: (topic: string) => void;
}

export const TrainingCenterView: React.FC<TrainingCenterViewProps> = ({
  courses,
  currentTaxYear,
  onNavigateToScenarioLab,
  onGenerateTraining,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse>(courses[0]);
  const [selectedLesson, setSelectedLesson] = useState<TrainingLesson>(
    courses[0]?.lessons[0]
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['lesson-8867-core']);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    if (!selectedLesson?.quiz) return 0;
    let correct = 0;
    selectedLesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / selectedLesson.quiz.length) * 100);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (!completedLessons.includes(selectedLesson.id)) {
      setCompletedLessons((prev) => [...prev, selectedLesson.id]);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Training Overview & Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Tax Preparer Academy
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">IRS Circular 230 & Form 8867 Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Preparer Training & Certification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Master statutory due diligence, client interview techniques, and tax code application. Test your knowledge with interactive quizzes and real-world scenario simulations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToScenarioLab}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Scenario Lab</span>
          </button>
        </div>
      </div>

      {/* Main Training Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Course & Lesson Navigation */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Training Courses
          </div>
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="p-3.5 border-b border-slate-100 bg-slate-50">
                <div className="text-[10px] font-bold text-rose-700 uppercase">
                  {c.category}
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {c.title}
                </div>
              </div>

              <div className="p-2 space-y-1">
                {c.lessons.map((lesson) => {
                  const isSelected = selectedLesson?.id === lesson.id;
                  const isCompleted = completedLessons.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLesson(lesson);
                        handleResetQuiz();
                      }}
                      className={`w-full p-2.5 rounded-lg text-left text-xs transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 text-rose-950 font-bold border border-rose-300'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {lesson.estimatedMinutes}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick AI Training Generator Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Generate Custom Lesson
            </span>
            <p className="text-[11px] text-slate-500">
              Turn any IRS notice or complex return topic into an interactive lesson.
            </p>
            <button
              onClick={() => onGenerateTraining('Educator Expense & Form 8863 Education Credits')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              Generate Lesson via Super Agent
            </button>
          </div>
        </div>

        {/* Right Column (3 Cols): Active Lesson Reader + Quiz */}
        {selectedLesson && (
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            {/* Lesson Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-bold text-rose-400 uppercase tracking-wider">Lesson</span>
                  <span>•</span>
                  <span>Difficulty: {selectedLesson.difficulty}</span>
                  <span>•</span>
                  <span>Est: {selectedLesson.estimatedMinutes} mins</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {selectedLesson.title}
                </h2>
              </div>

              {completedLessons.includes(selectedLesson.id) && (
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lesson Completed</span>
                </div>
              )}
            </div>

            {/* Lesson Content Body */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800">
              {/* Learning Objectives */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Learning Objectives
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {selectedLesson.learningObjectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lesson Text */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-4">
                {selectedLesson.content}
              </div>

              {/* Red Flags & Due Diligence Focus Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Audit Red Flags
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-900">
                    {selectedLesson.redFlags.map((rf, idx) => (
                      <li key={idx}>⚠ {rf}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Due Diligence Best Practice
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {selectedLesson.dueDiligenceFocus}
                  </p>
                </div>
              </div>

              {/* Interactive Lesson Knowledge Check / Quiz */}
              {selectedLesson.quiz && selectedLesson.quiz.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Lesson Knowledge Check ({selectedLesson.quiz.length} Questions)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select the correct answer based on statutory tax law and IRS guidelines.
                      </p>
                    </div>

                    {quizSubmitted && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          Score: {calculateScore()}%
                        </span>
                        <button
                          onClick={handleResetQuiz}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Retry
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedLesson.quiz.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[q.id];
                      const isAnswered = selectedOpt !== undefined;

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                        >
                          <div className="text-xs font-bold text-slate-900 flex items-start gap-2">
                            <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-mono">
                              Q{qIdx + 1}
                            </span>
                            <span>{q.question}</span>
                          </div>

                          <div className="space-y-1.5">
                            {q.options.map((opt, oIdx) => {
                              const isSelected = selectedOpt === oIdx;
                              const isCorrect = q.correctIndex === oIdx;

                              let optClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                              if (quizSubmitted) {
                                if (isCorrect) {
                                  optClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  optClass = 'bg-rose-100 border-rose-500 text-rose-900';
                                }
                              } else if (isSelected) {
                                optClass = 'bg-slate-800 border-slate-800 text-white font-semibold';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, oIdx)}
                                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition flex items-center justify-between cursor-pointer ${optClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isCorrect && (
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                  {quizSubmitted && isSelected && !isCorrect && (
                                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Post-submit explanation */}
                          {quizSubmitted && (
                            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                              <div className="font-bold text-slate-800">Explanation:</div>
                              <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                              <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                                Authority: {q.irsSourceRef}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted && (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.length}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm transition"
                    >
                      <span>Submit Answers & Record Score</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
