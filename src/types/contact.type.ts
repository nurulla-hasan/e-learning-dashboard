type Reply = {
  id: string;
  message: string;
  status: "IN_PROGRESS" | "CLOSED" | "OPEN" | string;
  createdAt: string;
};

export type IContact = {
  id: string;
  message: string;
  userEmail: string;
  userPhone: string;
  status: "IN_PROGRESS" | "CLOSED" | "OPEN" | string;
  createdAt: string;
  updatedAt: string;
  totalReplies: number;
  hasReplies: boolean;
  latestReply: Reply;
  isOpen: boolean;
  isInProgress: boolean;
  isClosed: boolean;
  replies: Reply[];
};
