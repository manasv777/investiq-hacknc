import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OnboardingData, OnboardingStep, ChatMessage } from "@/lib/schemas";
import { generateId } from "@/lib/utils";

interface SessionState {
  // Session info
  sessionId: string;
  userId?: string;
  
  // Onboarding data
  onboardingData: OnboardingData;
  
  // Chat history
  chatMessages: ChatMessage[];
  
  // UI state
  showPrivateInput: boolean;
  
  // Actions
  initializeSession: (userId?: string) => void;
  updateOnboardingData: (updates: Partial<OnboardingData>) => void;
  setCurrentStep: (step: OnboardingStep) => void;
  markStepComplete: (step: OnboardingStep) => void;
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setShowPrivateInput: (show: boolean) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
  sessionId: generateId(),
  chatMessages: [],
  showPrivateInput: false,
  
  onboardingData: {
    sessionId: generateId(),
    currentStep: "A",
    completedSteps: [],
  },

  initializeSession: (userId?: string) => {
    const sessionId = generateId();
    set({
      sessionId,
      userId,
      onboardingData: {
        sessionId,
        userId,
        currentStep: "A",
        completedSteps: [],
        startedAt: new Date().toISOString(),
      },
      chatMessages: [],
    });
  },

  updateOnboardingData: (updates) => {
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        ...updates,
      },
    }));
  },

  setCurrentStep: (step) => {
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        currentStep: step,
      },
    }));
  },

  markStepComplete: (step) => {
    set((state) => {
      const completedSteps = state.onboardingData.completedSteps || [];
      if (!completedSteps.includes(step)) {
        return {
          onboardingData: {
            ...state.onboardingData,
            completedSteps: [...completedSteps, step],
          },
        };
      }
      return state;
    });
  },

  addChatMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    
    set((state) => ({
      chatMessages: [...state.chatMessages, newMessage],
    }));
  },

  setShowPrivateInput: (show) => {
    set({ showPrivateInput: show });
  },

  resetSession: () => {
    const sessionId = generateId();
    set({
      sessionId,
      userId: undefined,
      onboardingData: {
        sessionId,
        currentStep: "A",
        completedSteps: [],
        startedAt: new Date().toISOString(),
      },
      chatMessages: [],
      showPrivateInput: false,
    });
  },
    }),
    {
      name: "investiq-session", // localStorage key
      version: 2,
      migrate: (persisted: any, _version) => {
        if (!persisted) return persisted;
        const d = persisted.onboardingData || {};
        const coerceBool = (v: any) => (v === true || v === "true" ? true : v === false || v === "false" ? false : v);
        const boolFields = [
          "hasMilitaryExperience",
          "isUsCitizen",
          "financialInstitutionEmployment",
          "isRestrictedPerson",
          "backupWithholding",
          "acknowledgedTerms",
          "acknowledgedRisks",
          "acknowledgedAccuracy",
          "acknowledgedPrivacy",
        ];
        boolFields.forEach((k) => {
          if (k in d) d[k] = coerceBool(d[k]);
        });
        persisted.onboardingData = d;
        return persisted;
      },
      partialize: (state) => ({
        sessionId: state.sessionId,
        userId: state.userId,
        onboardingData: state.onboardingData,
        chatMessages: state.chatMessages,
        showPrivateInput: state.showPrivateInput,
      }),
    }
  )
);

