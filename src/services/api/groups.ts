import {
  CreateGroupPayload,
  JoinGroupPayload,
  GroupResponse,
  LeaveGroupResponse,
} from '@/types/api';
import { api } from './client';

export const createGroup = async (
  payload: CreateGroupPayload,
): Promise<GroupResponse> => {
  const { data } = await api.post<GroupResponse>('/groups', payload);
  return data;
};

export const joinGroup = async (
  payload: JoinGroupPayload,
): Promise<GroupResponse> => {
  const { data } = await api.post<GroupResponse>('/groups/join', payload);
  return data;
};

export const getMyGroups = async (): Promise<GroupResponse[]> => {
  const { data } = await api.get<GroupResponse[]>('/groups');
  return data;
};

export const getGroup = async (id: string): Promise<GroupResponse> => {
  const { data } = await api.get<GroupResponse>(`/groups/${id}`);
  return data;
};

export const leaveGroup = async (
  id: string,
): Promise<LeaveGroupResponse> => {
  const { data } = await api.delete<LeaveGroupResponse>(
    `/groups/${id}/leave`,
  );
  return data;
};