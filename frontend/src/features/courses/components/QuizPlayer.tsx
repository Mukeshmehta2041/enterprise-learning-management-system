import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Heading3, Paragraph } from '@/shared/ui/Typography'
import { CheckCircle2, XCircle, AlertCircle, RefreshCcw, ArrowRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { QuizQuestion } from '@/shared/types/content'

interface QuizPlayerProps {
  questions: QuizQuestion[]
  onComplete: () => void
}

export function QuizPlayer({ questions, onComplete }: QuizPlayerProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'active' | 'result'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleStart = () => {
    setCurrentStep('active')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowFeedback(false)
  }

  const handleSelectOption = (optionId: string) => {
    if (showFeedback) return
    setAnswers({ ...answers, [currentQuestion.id]: optionId })
  }

  const handleSubmitAnswer = () => {
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setCurrentStep('result')
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowFeedback(false)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) {
        correct++
      }
    })
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-900 rounded-xl border border-slate-800">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <Heading3>No questions found</Heading3>
        <Paragraph className="text-slate-400">This quiz doesn't have any questions yet.</Paragraph>
      </div>
    )
  }

  if (currentStep === 'intro') {
    return (
      <div className="max-w-xl w-full bg-slate-900 p-8 rounded-xl border border-slate-800 text-center animate-in fade-in zoom-in duration-300">
        <div className="h-16 w-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="h-8 w-8 text-orange-500" />
        </div>
        <Heading3 className="mb-2">Knowledge Check</Heading3>
        <Paragraph className="text-slate-400 mb-8">
          This quiz contains {questions.length} questions to test your understanding of the material.
        </Paragraph>
        <Button onClick={handleStart} size="lg" className="w-full">
          Start Quiz
        </Button>
      </div>
    )
  }

  if (currentStep === 'result') {
    const { correct, total, percentage } = calculateScore()
    const isPassed = percentage >= 70

    return (
      <div className="max-w-xl w-full bg-slate-900 p-8 rounded-xl border border-slate-800 text-center animate-in fade-in zoom-in duration-300">
        <div className={cn(
          "h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6",
          isPassed ? "bg-emerald-500/10" : "bg-red-500/10"
        )}>
          {isPassed ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          ) : (
            <XCircle className="h-10 w-10 text-red-500" />
          )}
        </div>
        <Heading3 className="mb-2">
          {isPassed ? 'Great Job!' : 'Keep Practicing'}
        </Heading3>
        <div className="text-4xl font-bold mb-2">
          {percentage}%
        </div>
        <Paragraph className="text-slate-400 mb-8">
          You got {correct} out of {total} questions correct.
        </Paragraph>

        <div className="flex flex-col gap-3">
          <Button onClick={onComplete} className="w-full">
            Back to Lesson
          </Button>
          <Button onClick={handleStart} variant="ghost" className="w-full text-slate-400">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  const selectedOptionId = answers[currentQuestion.id]
  const isCorrect = selectedOptionId === currentQuestion.correctOptionId

  return (
    <div className="max-w-2xl w-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-800 w-full">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <Heading3 className="text-xl mb-8 leading-relaxed">
          {currentQuestion.questionText}
        </Heading3>

        <div className="space-y-4 mb-10">
          {Object.entries(currentQuestion.options).map(([id, text]) => (
            <button
              key={id}
              onClick={() => handleSelectOption(id)}
              disabled={showFeedback}
              className={cn(
                "w-full text-left p-5 rounded-lg border transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/50",
                !showFeedback && selectedOptionId === id && "border-primary bg-primary/5 text-white active:scale-[0.98]",
                !showFeedback && selectedOptionId !== id && "border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800",
                showFeedback && id === currentQuestion.correctOptionId && "border-emerald-500 bg-emerald-500/10 text-emerald-500",
                showFeedback && selectedOptionId === id && id !== currentQuestion.correctOptionId && "border-red-500 bg-red-500/10 text-red-500 opacity-100",
                showFeedback && id !== currentQuestion.correctOptionId && selectedOptionId !== id && "border-slate-800 bg-slate-800/50 text-slate-700"
              )}
            >
              <div className="flex items-center">
                <div className={cn(
                  "h-6 w-6 rounded-full border mr-4 flex items-center justify-center text-xs font-bold",
                  selectedOptionId === id ? "border-primary bg-primary text-white" : "border-slate-700"
                )}>
                  {id.toUpperCase()}
                </div>
                <span className="flex-grow">{text}</span>
                {showFeedback && id === currentQuestion.correctOptionId && (
                  <CheckCircle2 className="h-5 w-5 ml-2" />
                )}
                {showFeedback && selectedOptionId === id && id !== currentQuestion.correctOptionId && (
                  <XCircle className="h-5 w-5 ml-2" />
                )}
              </div>
            </button>
          ))}
        </div>

        {!showFeedback ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedOptionId}
            className="w-full py-6 text-lg"
          >
            Submit Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-full py-6 text-lg"
            variant={isCorrect ? "primary" : "secondary"}
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

function HelpCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
