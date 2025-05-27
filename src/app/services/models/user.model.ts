export interface UserModel {
  username?: string;
  percentage?: string;
  pick2Percentage?: string;
  suertresPercentage?: string,
  pick3Percentage?: string,
  refCode?: string;
  type?: string;
  refUrl?: string;
  id?: string;
}

export interface UserAccount {
  points?: number;
  commission?: number;
  pick2Commission?: number;
  suertresCommission?: number;
  pick3Commission?: number;
  tickets?: number;
  accumulatedComs?: number;
  rewards?: number;
}
