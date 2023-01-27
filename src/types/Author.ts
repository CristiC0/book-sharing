export type Author = {
  id: string;
  firstName: string;
  lastName: string;
  proposedBy: string;
  userName: string | null;
  similarWithName?: string;
  similarWithId?: string;
};
