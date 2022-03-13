import { createStore, action, thunk, createTypedHooks } from 'easy-peasy';
import type { Action, Thunk } from 'easy-peasy'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import type { Unsubscribe, User } from 'firebase/auth';

import { auth as fbAuth } from '../firebase';

interface StoreModel {
  auth: Auth
}

interface Auth {
  wasChecked: boolean;
  user: null|User;
  signInError: null|string;
  setUser: Action<Auth, null|User>;
  setWasChecked: Action<Auth, boolean>;
  setSignInError: Action<Auth, null|string>;
  handleAuthChange: Action<Auth, null|User>;
  // subscribeAuthChange: Thunk<Auth, null>;
  signIn: Thunk<Auth, {email: string, password: string}>;
  signOut: Thunk<Auth, null>;
}

export const store = createStore<StoreModel>({
  auth: {
    // store
    wasChecked: false,
    user: null,
    signInError: null,
    // actions
    setUser: action((state, payload) => {
      console.log("setting user", payload?.email)
      state.user = payload;
    }),
    setWasChecked: action((state, payload) => {
      state.wasChecked = payload;
    }),
    setSignInError: action((state, payload) => {
      state.signInError = payload;
    }),
    handleAuthChange: action((state, payload) => {
      state.user = payload;
      state.wasChecked = true;
    }),
    signIn: thunk(async (actions, payload) => {
      try {
        await signInWithEmailAndPassword(fbAuth, payload.email, payload.password)
        actions.setWasChecked(true);
      } catch (err) {
        console.log(err)
        actions.setSignInError("Something went wrong during sign in process.");
      }
    }),
    signOut: thunk(async (actions, _) => {
      await signOut(fbAuth)
      actions.setWasChecked(true)
      actions.setUser(null)
    })
  },
})


const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;
