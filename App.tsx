import React, { useState } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import PlanDashboard from './components/PlanDashboard';
import ProgramDetails from './components/ProgramDetails';
import ActiveWorkout from './components/ActiveWorkout';
import Completion from './components/Completion';
import UserStatusBar from './components/UserStatusBar';
import { UserProfile, TrainingPlan, TrainingSession, UserProgress } from './types';
import { generateTrainingPlans } from './services/geminiService';
import { Zap } from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  xp: 1200,
  level: 4,
  streak: 3,
  completedWorkouts: 12,
  history: [
    { week: "Week 1", xp: 300, completedSessions: 3 },
    { week: "Week 2", xp: 600, completedSessions: 6 },
    { week: "Week 3", xp: 900, completedSessions: 9 },
    { week: "Week 4", xp: 1200, completedSessions: 12 }
  ]
};

enum AppState {
  ONBOARDING,
  DASHBOARD,
  PROGRAM_DETAILS,
  WORKOUT,
  COMPLETION
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);

  const handleOnboardingSubmit = async (profile: UserProfile) => {
    setLoading(true);
    try {
      const generatedPlans = await generateTrainingPlans(profile);
      setPlans(generatedPlans);
      setAppState(AppState.DASHBOARD);
    } catch (error) {
      console.error("Failed to generate plans", error);
      alert("Failed to connect to the Sensei AI. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: TrainingPlan) => {
    setActivePlan(plan);
    setAppState(AppState.PROGRAM_DETAILS);
  };

  const handleSelectSession = (session: TrainingSession) => {
    setActiveSession(session);
    setAppState(AppState.WORKOUT);
  };

  const handleWorkoutComplete = () => {
    setUserProgress(prev => {
      const nextXp = prev.xp + 150;
      const nextCompleted = prev.completedWorkouts + 1;
      let nextHistory = prev.history ? [...prev.history] : [];
      
      const hasWeek5 = nextHistory.some(h => h.week === "Week 5");
      if (hasWeek5) {
        nextHistory = nextHistory.map(h => 
          h.week === "Week 5" 
            ? { ...h, xp: nextXp, completedSessions: nextCompleted } 
            : h
        );
      } else {
        nextHistory.push({
          week: "Week 5",
          xp: nextXp,
          completedSessions: nextCompleted
        });
      }

      return {
        ...prev,
        xp: nextXp,
        completedWorkouts: nextCompleted,
        streak: prev.streak + 1,
        history: nextHistory
      };
    });
    setAppState(AppState.COMPLETION);
  };

  const handleReset = () => {
    // Return to Program Details or Dashboard? 
    // Usually Dashboard to allow switching plans or seeing progress, 
    // but staying in details is good for continuing the week.
    // Let's go to Dashboard for now to keep it clean.
    setActiveSession(null);
    setAppState(AppState.DASHBOARD);
  };

  const handleBackToDashboard = () => {
    setActivePlan(null);
    setAppState(AppState.DASHBOARD);
  };
  
  const handleBackToProgram = () => {
    setActiveSession(null);
    setAppState(AppState.PROGRAM_DETAILS);
  };

  return (
    <Layout>
      {/* User Status Bar (Visible in Dashboard and Program Details) */}
      {(appState === AppState.DASHBOARD || appState === AppState.PROGRAM_DETAILS) && (
        <UserStatusBar progress={userProgress} />
      )}

      {appState === AppState.ONBOARDING && (
        <Onboarding onSubmit={handleOnboardingSubmit} isLoading={loading} />
      )}

      {appState === AppState.DASHBOARD && (
        <PlanDashboard plans={plans} onSelectPlan={handleSelectPlan} progress={userProgress} />
      )}

      {appState === AppState.PROGRAM_DETAILS && activePlan && (
        <ProgramDetails 
            plan={activePlan} 
            onSelectSession={handleSelectSession}
            onBack={handleBackToDashboard}
        />
      )}

      {appState === AppState.WORKOUT && activeSession && (
        <ActiveWorkout 
          session={activeSession}
          onComplete={handleWorkoutComplete}
          onBack={handleBackToProgram}
        />
      )}

      {appState === AppState.COMPLETION && (
        <Completion onReset={handleReset} xpEarned={150} />
      )}
    </Layout>
  );
};

export default App;