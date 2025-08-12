import { getStoredValue } from '@/utils/storage';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState
} from 'react';

export enum GameMode {
  Public = 'public',
  Private = 'private'
}

export enum GameTokenType {
  TOKEN = 'token',
  NATIVE = 'native'
}

interface GameSettingProviderProps extends PropsWithChildren {
  localStoragePrefix?: string;
}

type GameSettingState = {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  tokenType: GameTokenType;
  setTokenType: (tokenType: GameTokenType) => void;
};

const initialState: GameSettingState = {
  mode: GameMode.Public,
  setMode: () => null,
  tokenType: GameTokenType.TOKEN,
  setTokenType: () => {}
};

export const GameSettingContext = createContext(initialState);

export const GameSettingProvider = ({
  children,
  localStoragePrefix = ''
}: GameSettingProviderProps) => {
  const gameModeKey = localStoragePrefix + '_game_mode';

  const [mode, setMode] = useState<GameMode>(() =>
    getStoredValue<GameMode>(gameModeKey, GameMode.Public)
  );

  const [tokenType, setTokenType] = useState<GameTokenType>(
    GameTokenType.TOKEN
  );

  const updateMode = (newMode: GameMode) => {
    localStorage.setItem(gameModeKey, newMode);
    setMode(newMode);
  };

  const updateTokenType = (newTokenType: GameTokenType) => {
    setTokenType(newTokenType);
  };

  const value = {
    mode,
    setMode: updateMode,
    tokenType,
    setTokenType: updateTokenType
  };
  return (
    <GameSettingContext.Provider value={value}>
      {children}
    </GameSettingContext.Provider>
  );
};

export const useGameSetting = () => {
  return useContext(GameSettingContext);
};
