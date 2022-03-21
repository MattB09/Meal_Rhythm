import { action, thunk } from 'easy-peasy'
import type { Action, Thunk } from 'easy-peasy'
import {  
  query, collection, getDocs, orderBy, setDoc, doc, deleteDoc 
} from 'firebase/firestore'

import { firestore } from '../firebase';


export type Fast = {
    id: string,
    startTime: Date,
    endTime: Date,
    elapsedSeconds: number,
    feeling: null|number,
    note: null|string
}


export interface FastStore {
    fastList: Fast[];
    fastError: null|string;
    fetchingFast: boolean;
    setFasts: Action<FastStore, Fast[]>
    addFast: Action<FastStore, Fast>
    editFast: Action<FastStore, Fast>
    deleteFastLocal: Action<FastStore, string>
    setFastError: Action<FastStore, null|string>
    setFetching: Action<FastStore, boolean>
    fetchFasts: Thunk<FastStore, string>
    saveFast: Thunk<FastStore, {fast: Fast, uid: string, type: 'save'|'edit'}>
    deleteFast: Thunk<FastStore, {fastId: string, uid: string}>
}


export const fast: FastStore = {
  // store
  fastList: [],
  fastError: null,
  fetchingFast: false,
  // actions
  setFasts: action((state, payload) => {
    state.fastList = payload;
  }),
  addFast: action((state, payload) => {
    state.fastList.unshift(payload)
  }),
  editFast: action((state, payload) => {
    const index = state.fastList.findIndex((item) => item.id === payload.id);
    state.fastList[index] = payload
    state.fastList.sort((a, b) => {
      if (a.startTime < b.startTime) return 1
      if (a.startTime > b.startTime) return -1
      return 0
    })
  }),
  deleteFastLocal: action((state, payload) => {
    const index = state.fastList.findIndex((item) => item.id === payload);
    state.fastList.splice(index, 1)
  }),
  setFastError: action((state, payload) => {
    state.fastError = payload;
  }),
  setFetching: action((state, payload) => {
    state.fetchingFast = payload;
  }),
  // thunks
  fetchFasts: thunk(async (actions, payload) => {
    try {
      actions.setFetching(true);
      actions.setFastError(null);
      const q = query(collection(firestore, `users/${payload}/fasts/`), orderBy("startTime", "desc"));
      const qSnapshot = await getDocs(q);
      const mapped = qSnapshot.docs.map((doc) => {
        const data = doc.data();
        const docObj = {
          id: data.id,
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
          elapsedSeconds: data.elapsedSeconds,
          feeling: data.feeling,
          note: data.note
        };
        return docObj
      })
      actions.setFasts(mapped)
    } catch (err: any) {
      actions.setFastError(<string>err!.code);
    } finally {
      actions.setFetching(false);
    }
  }),
  saveFast: thunk(async (actions, payload) => {
    try {
      await setDoc(doc(firestore, `users/${payload.uid}/fasts`, payload.fast.id), payload.fast)
      if (payload.type == 'save') actions.addFast(payload.fast)
      else if (payload.type == 'edit') actions.editFast(payload.fast)
    } catch (err: any) {
      console.log(err)
    }
  }),
  deleteFast: thunk(async (actions, payload) => {
    try {
      await deleteDoc(doc(firestore, `users/${payload.uid}/fasts`, payload.fastId))
      actions.deleteFastLocal(payload.fastId)
    } catch (err: any) {
      console.log(err)
    }
  }),
}