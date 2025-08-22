// Tipos/DTOs compartilhados entre cliente e servidor

export type KycStatus = 'pending' | 'review' | 'approved' | 'rejected';

export type KycSession = {
  id: string;
  userId: string;
  createdAt: string;
  status: KycStatus;
  reason?: string;
};

export type RemitStatus = 'created' | 'submitted' | 'settled' | 'failed';

export type Remit = {
  id: string;
  from: string;
  to: string;
  amount: number;
  feePct: number;
  status: RemitStatus;
  createdAt: string;
  userId?: string;
};

export type CreateRemitInput = {
  from: string;
  to: string;
  amount: number;
  userId?: string;
};
