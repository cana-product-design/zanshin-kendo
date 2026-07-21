import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProgress, UserProfile, TrainingPlan } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Error handling types and enums from guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Global firestore error logger and thrower
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 1. Connection Validation as requested by Guidelines
export async function testFirebaseConnection(): Promise<void> {
  const path = 'test/connection';
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    }
    // Silently continue or handle appropriately
  }
}

// 2. Auth handlers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Failed to sign in with Google Popup:", error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Failed to sign out:", error);
    throw error;
  }
}

// 3. User document shape mapping
export interface UserDoc {
  uid: string;
  email: string;
  name: string;
  progress: UserProgress;
  profile?: UserProfile;
  activePlan?: TrainingPlan | null;
  plans?: TrainingPlan[];
  createdAt?: string;
  updatedAt?: string;
}

// 4. Firestore persistence functions
export async function saveUserDocument(userId: string, data: Partial<UserDoc>, isNew = false): Promise<void> {
  const path = `users/${userId}`;
  try {
    const nowISO = new Date().toISOString();
    const payload: Record<string, any> = {
      ...data,
      updatedAt: nowISO
    };
    
    if (isNew) {
      payload.createdAt = nowISO;
    }

    await setDoc(doc(db, 'users', userId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

export async function getUserDocument(userId: string): Promise<UserDoc | null> {
  const path = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data() as UserDoc;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}
