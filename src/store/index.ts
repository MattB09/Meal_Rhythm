import { createStore, createTypedHooks } from 'easy-peasy';

import { auth } from './auth';
import { weight } from './weight';
import { fast } from './fast';
import type { AuthStore } from './auth';
import type { WeightStore } from './weight';
import type { FastStore } from './fast';


interface StoreModel {
  auth: AuthStore,
  weight: WeightStore,
  fast: FastStore,
}


export const store = createStore<StoreModel>({
  auth,
  weight,
  fast
})


const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
