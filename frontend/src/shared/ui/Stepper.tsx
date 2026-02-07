import { cn } from '@/shared/utils/cn'
import { Check } from 'lucide-react'

interface Step {
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number // 1-indexed
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = currentStep > stepNumber
            const isActive = currentStep === stepNumber
            const isLast = index === steps.length - 1

            return (
              <li
                key={step.title}
                className={cn('relative', !isLast && 'flex-1')}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="flex items-center group">
                  <span className="flex items-center">
                    <span
                      className={cn(
                        'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                        isCompleted
                          ? 'bg-indigo-600 border-indigo-600'
                          : isActive
                            ? 'border-indigo-600 bg-white'
                            : 'border-slate-300 bg-white'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            isActive ? 'text-indigo-600' : 'text-slate-500'
                          )}
                        >
                          {stepNumber}
                        </span>
                      )}
                    </span>
                  </span>

                  <div className="ml-4 flex min-w-0 flex-col">
                    <span
                      className={cn(
                        'text-sm font-semibold tracking-wide uppercase',
                        isActive ? 'text-indigo-600' : 'text-slate-500'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>

                  {!isLast && (
                    <div
                      className={cn(
                        'ml-4 h-0.5 flex-1 transition-colors',
                        isCompleted ? 'bg-indigo-600' : 'bg-slate-200'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
