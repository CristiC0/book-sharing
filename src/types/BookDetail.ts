export type BookDetail = {
  image: string;
  uploadedBy: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
  };
  title: string;
  authors: [
    {
      id: string;
      firstName: string;
      lastName: string;
      isApproved: boolean;
    }
  ];
  genres: [
    {
      id: string;
      name: string;
    }
  ];
  language: {
    id: string;
    name: string;
  };
  publicationDate: string;
  isAvailable: boolean;
};
