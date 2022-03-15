import { action, thunk } from 'easy-peasy'
import type { Action, Thunk } from 'easy-peasy'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth';

import { auth as fbAuth } from '../firebase';


export interface AuthStore {
  wasChecked: boolean;
  user: null|User;
  signInError: null|string;
  signUpError: null|string;
  setUser: Action<AuthStore, null|User>;
  setWasChecked: Action<AuthStore, boolean>;
  setSignInError: Action<AuthStore, null|string>;
  setSignUpError: Action<AuthStore, null|string>;
  handleAuthChange: Action<AuthStore, null|User>;
  signIn: Thunk<AuthStore, {email: string, password: string}>;
  signUp: Thunk<AuthStore, {email: string, password: string}>;
  signOut: Thunk<AuthStore, null>;
}


export const auth: AuthStore = {
  // store
  wasChecked: false,
  user: null,
  signInError: null,
  signUpError: null,
  // actions
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setWasChecked: action((state, payload) => {
    state.wasChecked = payload;
  }),
  setSignInError: action((state, payload) => {
    state.signInError = payload;
  }),
  setSignUpError: action((state, payload) => {
    state.signUpError = payload;
  }),
  handleAuthChange: action((state, payload) => {
    state.user = payload;
    state.wasChecked = true;
  }),
  signIn: thunk(async (actions, payload) => {
    try {
      actions.setSignInError(null)
      actions.setWasChecked(false);
      await signInWithEmailAndPassword(fbAuth, payload.email, payload.password);
    } catch (err: any) {
      console.log("error", err, err?.code);
      if (err.code === "auth/too-many-requests") {
        actions.setSignInError("Too many failed attempts. Try again later")
      } else {
        actions.setSignInError("Incorrect email and/or password.");
      }
    } finally {
      actions.setWasChecked(true);
    }
  }),
  signUp: thunk(async (actions, payload) => {
    try {
      actions.setSignUpError(null)
      actions.setWasChecked(false);
      await createUserWithEmailAndPassword(fbAuth, payload.email, payload.password);
    } catch (err: any) {
      console.log("error", err, err?.code);
      if (err.code == "auth/email-already-in-use") {
        actions.setSignUpError("User already exists...")
      } else {
        actions.setSignUpError("Something went wrong...")
      }
    } finally {
      actions.setWasChecked(true);
    }
  }),
  signOut: thunk(async (actions, _) => {
    actions.setWasChecked(false)
    await signOut(fbAuth)
    actions.setWasChecked(true)
  })
}