import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import PlanDashboard from './components/PlanDashboard';
import ProgramDetails from './components/ProgramDetails';
import ActiveWorkout from './components/ActiveWorkout';
import Completion from './components/Completion';
import UserStatusBar from './components/UserStatusBar';
import WelcomeScreen from './components/WelcomeScreen';
import { UserProfile, TrainingPlan, TrainingSession, UserProgress } from './types';
import { generateTrainingPlans } from './services/geminiService';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  saveUserDocument, 
  getUserDocument,
  testFirebaseConnection 
} from './services/firebaseService';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);

  // Initialize Firebase Connection test and listener on mount
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getUserDocument(currentUser.uid);
          if (userDoc) {
            // Document exists: load saved progress & programs
            setPlans(userDoc.plans || []);
            setActivePlan(userDoc.activePlan || null);
            setUserProgress(userDoc.progress || INITIAL_PROGRESS);
            setAppState(AppState.DASHBOARD);
          } else {
            // First time user: go to Onboarding
            setAppState(AppState.ONBOARDING);
          }
        } catch (error) {
          console.error("Error loading user state:", error);
          setAppState(AppState.ONBOARDING);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed Google Sign-In:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      // Reset local app states on signout
      setPlans([]);
      setActivePlan(null);
      setActiveSession(null);
      setUserProgress(INITIAL_PROGRESS);
    } catch (error) {
      console.error("Failed Sign Out:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (profile: UserProfile) => {
    setLoading(true);
    try {
      const generatedPlans = await generateTrainingPlans(profile);
      setPlans(generatedPlans);

      const freshProgress: UserProgress = {
        xp: 0,
        level: 1,
        streak: 1,
        completedWorkouts: 0,
        history: [
          { week: "Week 1", xp: 0, completedSessions: 0 }
        ]
      };
      setUserProgress(freshProgress);

      if (auth.currentUser) {
        await saveUserDocument(auth.currentUser.uid, {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          name: auth.currentUser.displayName || 'Kenshi',
          profile: profile,
          progress: freshProgress,
          plans: generatedPlans,
          activePlan: null
        }, true);
      }

      setAppState(AppState.DASHBOARD);
    } catch (error) {
      console.error("Failed to generate plans", error);
      alert("Failed to connect to the Sensei AI. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan: TrainingPlan) => {
    setActivePlan(plan);
    setAppState(AppState.PROGRAM_DETAILS);
    if (user) {
      try {
        await saveUserDocument(user.uid, { activePlan: plan });
      } catch (e) {
        console.error("Failed to persist active plan:", e);
      }
    }
  };

  const handleSelectSession = (session: TrainingSession) => {
    setActiveSession(session);
    setAppState(AppState.WORKOUT);
  };

  const handleWorkoutComplete = async () => {
    const nextXp = userProgress.xp + 150;
    const nextCompleted = userProgress.completedWorkouts + 1;
    const nextLevel = Math.floor(nextXp / 500) + 1; // 500 XP per level
    
    let nextHistory = userProgress.history ? [...userProgress.history] : [];
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

    const updatedProgress: UserProgress = {
      ...userProgress,
      xp: nextXp,
      level: nextLevel,
      completedWorkouts: nextCompleted,
      streak: userProgress.streak + 1,
      history: nextHistory
    };

    setUserProgress(updatedProgress);

    if (user) {
      try {
        await saveUserDocument(user.uid, { progress: updatedProgress });
      } catch (e) {
        console.error("Failed to persist progress:", e);
      }
    }
    setAppState(AppState.COMPLETION);
  };

  const handleReset = () => {
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
    <Layout userEmail={user?.email} onSignOut={handleSignOut}>
      {/* Loading Spinner for auth verification */}
      {authLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-red-950 border-t-red-500 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Verifying Ronin Credentials...</p>
        </div>
      ) : !user ? (
        /* If not signed in, show Google Authentication landing screen */
        <WelcomeScreen onSignIn={handleSignIn} isLoading={loading} />
      ) : (
        /* Authenticated application states */
        <>
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
        </>
      )}
    </Layout>
  );
};

export default App;