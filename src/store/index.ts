import { createStore, createTypedHooks } from 'easy-peasy';

import { auth } from './auth';
import { weight } from './weight'
import type { AuthStore } from './auth';
import type { WeightStore } from './weight'


interface StoreModel {
  auth: AuthStore,
  weight: WeightStore
}


export const store = createStore<StoreModel>({
  auth,
  weight
})


const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
