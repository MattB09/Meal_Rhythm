import { createStore, createTypedHooks } from 'easy-peasy';

import { auth } from './auth';
import type { Auth } from './auth';


interface StoreModel {
  auth: Auth
}


export const store = createStore<StoreModel>({
  auth: auth
})


const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
