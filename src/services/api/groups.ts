import {
  CreateGroupPayload,
  JoinGroupPayload,
  GroupResponse,
  LeaveGroupResponse,
  UpdateGroupPayload,
  MemberSplitResponse,
  MessageResponse,
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

export const regenerateInviteCode = async (
  id: string,
): Promise<GroupResponse> => {
  const { data } = await api.post<GroupResponse>(
    `/groups/${id}/regenerate-invite`,
  );
  return data;
};

export const leaveGroup = async (id: string): Promise<LeaveGroupResponse> => {
  const { data } = await api.delete<LeaveGroupResponse>(`/groups/${id}/leave`);
  return data;
};

export const updateGroup = async (
  id: string,
  payload: UpdateGroupPayload,
): Promise<GroupResponse> => {
  const { data } = await api.patch<GroupResponse>(`/groups/${id}`, payload);
  return data;
};

export const deleteGroup = async (id: string): Promise<MessageResponse> => {
  const { data } = await api.delete<MessageResponse>(`/groups/${id}`);
  return data;
};

export const archiveGroup = async (id: string): Promise<GroupResponse> => {
  const { data } = await api.post<GroupResponse>(`/groups/${id}/archive`);
  return data;
};

export const removeMember = async (
  groupId: string,
  memberId: string,
): Promise<MessageResponse> => {
  const { data } = await api.delete<MessageResponse>(
    `/groups/${groupId}/members/${memberId}`,
  );
  return data;
};

export const updateMemberSplit = async (
  groupId: string,
  memberId: string,
  percentage: number,
): Promise<MemberSplitResponse> => {
  const { data } = await api.patch<MemberSplitResponse>(
    `/groups/${groupId}/members/${memberId}/split`,
    { percentage },
  );
  return data;
};
