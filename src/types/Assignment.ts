export type Assignment = {
  id: string;
  bookTitle: string;
  startDate: string;
  endDate: string;
  status: string;
};
export type PendingAssignment = {
  id: string;
  bookName: string;
  requestedBy: string;
  requestedAt: string;
  startDate: string;
  endDate: string;
};
