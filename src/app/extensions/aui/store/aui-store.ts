import { createFeatureSelector } from '@ngrx/store';

export interface AuiState {}

export const getAuiState = createFeatureSelector<AuiState>('aui');
