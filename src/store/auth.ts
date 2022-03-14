import { action, thunk } from 'easy-peasy'
import type { Action, Thunk } from 'easy-peasy'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, ActionCodeOperation } from 'firebase/auth'
import type { User } from 'firebase/auth';

import { auth as fbAuth } from '../firebase';


export interface Auth {
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


export const auth: Auth = {
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
    console.log("Handling auth change in store", payload?.email)
    state.user = payload;
    state.wasChecked = true;
  }),
  signIn: thunk(async (actions, payload) => {
    try {
      actions.setWasChecked(false)
      await signInWithEmailAndPassword(fbAuth, payload.email, payload.password)
      actions.setWasChecked(true);
    } catch (err) {
      console.log(err)
      actions.setSignInError("Something went wrong during sign in process.");
      actions.setWasChecked(true)
    }
  }),
  signOut: thunk(async (actions, _) => {
    actions.setWasChecked(false)
    await signOut(fbAuth)
    actions.setWasChecked(true)
  })
}