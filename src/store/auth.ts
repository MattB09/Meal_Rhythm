import { action, thunk } from 'easy-peasy'
import type { Action, Thunk } from 'easy-peasy'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth';

import { auth as fbAuth } from '../firebase';


export interface Auth {
  wasChecked: boolean;
  user: null|User;
  signInError: null|string;
  signUpError: null|string;
  setUser: Action<Auth, null|User>;
  setWasChecked: Action<Auth, boolean>;
  setSignInError: Action<Auth, null|string>;
  setSignUpError: Action<Auth, null|string>;
  handleAuthChange: Action<Auth, null|User>;
  signIn: Thunk<Auth, {email: string, password: string}>;
  signUp: Thunk<Auth, {email: string, password: string}>;
  signOut: Thunk<Auth, null>;
}


export const auth: Auth = {
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
      actions.setWasChecked(false);
      await signInWithEmailAndPassword(fbAuth, payload.email, payload.password);
    } catch (err) {
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
      actions.setWasChecked(false);
      await createUserWithEmailAndPassword(fbAuth, payload.email, payload.password);
    } catch (err) {
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