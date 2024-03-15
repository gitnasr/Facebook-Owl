enum SyncSource {
  MANUALLY = 'MANUALLY',
  BY_POP_UP = 'BY_POP_UP',
  BY_TIMER = 'BY_TIMER',
  BY_BROWSER_OPEN = 'BY_BROWSER_OPEN',
}
enum DifferenceType {
  New,
  Removed,
  NoChanges,
}
interface ListDifference {
  changes: IFriend[];
  type: DifferenceType;
  count: number;
}
interface IFriend {
  firstName: string;
  lastName: string;
  profilePicture: string;
  accountId: number;
  fId: string;
  fullName: string;
  status?: string;
  addedOn?: Date;
}
interface IList {
  lId: string;
  friends: IFriend[];
  oId: string;
  changes: ListDifference[];
  bId: string;
  createdAt: Date;
  updatedAt: Date;
  source: SyncSource;
}
interface IOwner {
  accountName: string;
  accountId: number;
  browserId: string;
  profilePic: string;
  friendsCount: number;
  friendList: IList[];
  oId: string;
  pp_hash: string;
  updatedAt: Date;
  createdAt: Date;
}
interface History {
  list: IList;
  previous: number;
  options: HistoryDropdown[];
  changes: number;
}
export interface HistoryDropdown {
  lId: string;
  createdAt: Date;
  updatedAt: Date;
  changes: number;
}

export interface IHistoryResponse {
  status: 'success' | 'error';
  history: History;
  owner: Partial<IOwner>;
  isProcessing: boolean;
}
export interface IHistoryProps {
  data: IHistoryResponse;
  token: string;
}
export interface IHistoryDropdownProps {
  update: (data: IHistoryResponse) => void;
  options: HistoryDropdown[];
  listId: string;
}
export interface IAccountProps {
  owner: Partial<IOwner>;
}
export interface IStatsProps {
  changes: number;
  pervious: number;
  count: number;
}
export interface IAccountsResponse {
  _id: string;
  accountId: number;
  accountName: string;
  updatedAt: Date;
  friendList: {
    _id: string;
    lId: string;
  };
  oId: string;
  profilePic: string;
}
export interface ISwitchViewProps {
  accounts: IAccountsResponse[];
  refer: React.RefObject<HTMLDialogElement>;
  browserId: string;
  update: (p: string) => void;
}
