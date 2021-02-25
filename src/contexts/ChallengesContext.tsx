import { createContext, ReactNode, useEffect, useState } from 'react';

import challenges from '../../challenges.json';

export const ChallengesContext = createContext({} as IChallengeContextData);

interface IChallenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface IChallengeContextData {
  level: number;
  currentExperience: number,
  challengesCompleted: number,
  experienceToNextLevel: number;
  activeChallenge: IChallenge;
  levelUp: () => void,
  startNewChallenge: () => void,
  resetChallenge: () => void;
  completeChallenge: () => void;
}

interface IChallengesProviderProps {
  children: ReactNode;
}

export function ChallengesProvider({ children }: IChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);
  
  const experienceToNextLevel = Math.pow((level + 1) * 5, 2)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play()

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio!', {
        body: `Valendo ${challenge.amount} XP.`
      })
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if (!activeChallenge) return;

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;

      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  return (
    <ChallengesContext.Provider value={{
      level,
      currentExperience,
      challengesCompleted,
      levelUp,
      startNewChallenge,
      activeChallenge,
      resetChallenge,
      experienceToNextLevel,
      completeChallenge
    }}>
      {children}
    </ChallengesContext.Provider>
  )
}