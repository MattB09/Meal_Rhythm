import { action, thunk } from 'easy-peasy'
import type { Action, Thunk } from 'easy-peasy'
import {  query, collection, getDocs, orderBy, setDoc, doc } from 'firebase/firestore'

import { firestore } from '../firebase';

export type Weight = {
  id: string,
  weight: number,
  date: Date,
  note: null|string,
}

export interface WeightStore {
  weightList: Weight[];
  weightError: null|string;
  fetchingWeight: boolean;
  setWeights: Action<WeightStore, Weight[]>;
  addWeight: Action<WeightStore, Weight>;
  setWeightError: Action<WeightStore, null|string>;
  setFetching: Action<WeightStore, boolean>;
  fetchWeights: Thunk<WeightStore, string>;
  saveWeight: Thunk<WeightStore, {weight: Weight, uid: string}>
}

export const weight: WeightStore = {
  //store
  weightList: [],
  weightError: null,
  fetchingWeight: false,
  //actions
  setWeights: action((state, payload) => {
    state.weightList = payload;
  }),
  addWeight: action((state, payload) => {
    state.weightList.unshift(payload)
    // state.weightList.sort((a, b) => {
    //   if (a.date < b.date) return 1
    //   if (a.date > b.date) return -1
    //   return 0
    // })
  }),
  setWeightError: action((state, payload) => {
    state.weightError = payload;
  }),
  setFetching: action((state, payload) => {
    state.fetchingWeight = payload;
  }),
  //thunks
  fetchWeights: thunk(async (actions, payload) => {
    try {
      actions.setFetching(true)
      actions.setWeightError(null);
      const q = query(collection(firestore, `users/${payload}/weights/`), orderBy("date", "desc"));
      const qSnapshot = await getDocs(q);
      const mapped = qSnapshot.docs.map((doc) => {
        const data = doc.data();
        const docObj = {
          id: data.id,
          weight: data.weight,
          date: data.date.toDate(),
          note: data.note,
        };
        return docObj;
      })
      actions.setWeights(mapped);
    } catch (err: any) {
      console.log(err);
      actions.setWeightError(<string>err!.code);
    } finally {
      actions.setFetching(false)
    }
  }),
  saveWeight: thunk(async (actions, payload) => {
    try {
      await setDoc(doc(firestore, `users/${payload.uid}/weights`, payload.weight.id), payload.weight)
      actions.addWeight(payload.weight)
    } catch (err: any) {
      console.log(err)
    }
  })
}