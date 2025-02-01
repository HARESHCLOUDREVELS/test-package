interface AgentUser {
    id: string;
    tenantId: string;
    roleId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    defaultLanguage: string;
    userUniqueCode: string;
    nationalId?: string | null;
  }
  
  interface UserAdditionalInformation {
    id: string;
    tenantId: string;
    userId: string;
    financeApplicationId: string;
    title?: string | null;
    fullName: string;
    phoneNumber: string;
    financeApplicationNumber: string;
    jobType: string;
    nationalId: string;
    personalEmailAddress: string;
    workEmailAddress?: string;
    hpNumber: string;
    jobUniqueCode: string;
    motherFullName: string;
    membershipNumber?: string;
    dateOfBirth: string;
    sex: string;
    race: string;
    religion: string;
    highestQualification: string;
    maritalStatus: string;
    otherId?: string | null;
    isDefault: boolean;
    created: string;
    lastModified: string;
    status: string;
    isApproved: boolean;
    approvedByUserId?: string | null;
    approvedByUser?: string | null;
    age?: number | null;
    createdBy: string;
    lastModifiedBy: string;
  }
  
  export interface Contact {
    id: string;
    tenantId: string;
    roleId: string;
    parentId: string;
    tenantName: string;
    roleName: string;
    fullName: string;
    parentUserName: string;
    title: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    defaultLanguage: string;
    created: string;
    lastModified: string;
    forcePasswordChange: boolean;
    status: string;
    userUniqueCode: string;
    agentCode: string;
    createdBy: string;
    lastModifiedBy: string;
    assignedApplicationCount: number;
    isUserAdditionalInfoCompleted: boolean;
    isUserBankingDetailCompleted: boolean;
    isUserAddressCompleted: boolean;
    isUserDocumentsCompleted: boolean;
    isUserEmploymentDetailCompleted: boolean;
    isUserExistingFinanceCompleted: boolean;
    isUserIncomeDetailCompleted: boolean;
    isUserRelativeDetailCompleted: boolean;
    subUserList?: null | unknown;
    agentUser: AgentUser;
    userAdditionalInformation: UserAdditionalInformation;
  }
  
  interface UserDetail {
    id: string;
    tenantId: string;
    roleId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage: string;
    defaultLanguage: string;
    userUniqueCode?: string | null;
    nationalId?: string | null;
  }
  
  interface LastChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    messageText: string;
    fileURL?: string | null;
    readAt?: string | null;
    created: string;
    lastModified: string;
    senderUserDetail?: UserDetail | null;
    receiverUserDetail?: UserDetail | null;
    status: string;
  }
  
  export interface Chat {
    id: string;
    userOneId: string;
    userTwoId: string;
    lastChatMessageId: string;
    created: string;
    lastModified: string;
    status: string;
    userDetail: UserDetail;
    lastChatMessage: LastChatMessage;
  }
  