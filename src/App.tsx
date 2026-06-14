import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GoalSelection from './components/GoalSelection';
import GoalAmount from './components/GoalAmount';
import MonthlyInvestment from './components/MonthlyInvestment';
import ResultsScreen from './components/ResultsScreen';
import ProgressBar from './components/ProgressBar';

export interface Goal {
  id: string;
  emoji: string;
  title: string;
  defaultAmount?: number;
}

export interface AppState {
  step: number;
  selectedGoal: Goal | null;
  targetAmount: number;
  monthlyInvestment: number;
  annualReturn: number;
  userName: string;
  age: number;
}

const INITIAL_STATE: AppState = {
  step: 1,
  selectedGoal: null,
  targetAmount: 0,
  monthlyInvestment: 0,
  annualReturn: 12,
  userName: '',
  age: 22,
};

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const goToNextStep = () => {
    setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
  };

  const goToPreviousStep = () => {
    setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const selectGoal = (goal: Goal) => {
    setState(prev => ({
      ...prev,
      selectedGoal: goal,
      targetAmount: goal.defaultAmount || 0,
    }));
    setTimeout(goToNextStep, 300);
  };

  const setTargetAmount = (amount: number) => {
    setState(prev => ({ ...prev, targetAmount: amount }));
  };

  const setMonthlyInvestment = (amount: number) => {
    setState(prev => ({ ...prev, monthlyInvestment: amount }));
  };

  const setUserName = (name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  };

  const setAnnualReturn = (rate: number) => {
    setState(prev => ({ ...prev, annualReturn: rate }));
  };

  const setAge = (age: number) => {
    setState(prev => ({ ...prev, age }));
  };

  const startOver = () => {
    setState(INITIAL_STATE);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-success/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar */}
        {state.step < 4 && (
          <div className="px-4 pt-4 md:px-8 md:pt-8">
            <ProgressBar currentStep={state.step} totalSteps={3} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-6 md:px-8 md:py-12">
          <div className="w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.step}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {state.step === 1 && (
                  <GoalSelection onSelectGoal={selectGoal} selectedGoal={state.selectedGoal} />
                )}
                {state.step === 2 && (
                  <GoalAmount
                    goal={state.selectedGoal!}
                    amount={state.targetAmount}
                    onAmountChange={setTargetAmount}
                    onNext={goToNextStep}
                    onBack={goToPreviousStep}
                  />
                )}
                {state.step === 3 && (
                  <MonthlyInvestment
                    targetAmount={state.targetAmount}
                    amount={state.monthlyInvestment}
                    onAmountChange={setMonthlyInvestment}
                    annualReturn={state.annualReturn}
                    onAnnualReturnChange={setAnnualReturn}
                    userName={state.userName}
                    onUserNameChange={setUserName}
                    age={state.age}
                    onAgeChange={setAge}
                    onNext={goToNextStep}
                    onBack={goToPreviousStep}
                  />
                )}
                {state.step === 4 && (
                  <ResultsScreen
                    state={state}
                    onUpdateMonthlyInvestment={setMonthlyInvestment}
                    onUpdateAnnualReturn={setAnnualReturn}
                    onStartOver={startOver}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 px-4 text-sm text-gray-500">
          <p>
            Copyright 2026 Anurag Giri |{' '}
            <a
              href="https://www.instagram.com/anuraggirispeaks/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors"
            >
              @anuraggirispeaks
            </a>{' '}
            | All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
