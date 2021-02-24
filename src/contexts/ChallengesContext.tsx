import { createContext, ReactNode, useState } from 'react';

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
  levelUp: () => void,
  startNewChallenge: () => void,
  activeChallenge: IChallenge;
  resetChallenge: () => void;
  experienceToNextLevel: number;
}

interface IChallengesProviderProps {
  children: ReactNode;
}

export function ChallengesProvider({ children }: IChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(30);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);
  
  const experienceToNextLevel = Math.pow((level + 1) * 5, 2)

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge);
  }

  function resetChallenge() {
    setActiveChallenge(null);
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
      experienceToNextLevel
    }}>
      {children}
    </ChallengesContext.Provider>
  )
}