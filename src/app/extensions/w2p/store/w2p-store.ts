import { createFeatureSelector } from '@ngrx/store';

export interface W2pState {}

export const getW2pState = createFeatureSelector<W2pState>('w2p');
