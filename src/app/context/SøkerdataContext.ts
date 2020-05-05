import { createContext } from 'react';
import { Søkerdata } from '../types/Søkerdata';

export const SøkerdataContext = createContext<Søkerdata | undefined>(undefined);

export const SøkerdataContextProvider = SøkerdataContext.Provider;
export const SøkerdataContextConsumer = SøkerdataContext.Consumer;
