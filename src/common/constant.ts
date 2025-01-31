// languages
export const languages: string[] = ["English", "Malay"];

// Tenant ID
export const tenantId: string = "247df315-f9a5-43ce-b15a-a9570804ad71";

// Super Admin Role Id
export const superAdminRoleId = "78ba9859-651a-4350-9130-0e465d887d65";
export const adminRoleId = "42631b62-8d37-4f79-9b92-a61bca0d58c2";

// Role ID
export const roleId: string = "b24a113f-b85d-4249-8238-4d0c7dc01a43";

//Agent Role Id
export const agentRoleId: string = "b7db3bac-4347-4c51-a3fa-3215d1b30b75";

//Agent Role Id
export const staffMemberRoleId: string = "307c341e-ab9e-424a-a7e7-4bcb8144b081";

export const miniAgentRoleId: string = "bcf233e8-dc76-4b02-8f29-d5e6a18d6de3";

// Titles
export const titles: any[] = [
  {
    id: "MR.",
    label: "MR",
  },
  {
    id: "MRS.",
    label: "MRS",
  },
  {
    id: "MISS.",
    label: "MISS",
  },
  {
    id: "OTHER",
    label: "OTHER",
  },
];

// Sexs
export const sexs: any[] = [
  {
    id: "MALE",
    label: "MALE",
  },
  {
    id: "FEMALE",
    label: "FEMALE",
  },
];

// Job types
export const jobTypes: any[] = [
  {
    id: "ARMY",
    label: "ARMY",
  },
  {
    id: "POLICE",
    label: "POLICE",
  },
  {
    id: "OTHER",
    label: "OTHER",
  },
];

export const accountType: any[] = [
  {
    id: "SAVING",
    label: "SAVING",
  },
  {
    id: "CURRENT",
    label: "CURRENT",
  },
];

export const financeApplicationStatus = {
  Draft: "Draft",
  Submitted: "Submitted",
  Processing: "Processing",
  ActionRequired: "ActionRequired",
  Review: "Review",
  Approved: "Approved",
  ConditionalApproved: "ConditionalApproved",
  Rejected: "Rejected",
  KIV: "KIV",
  PendingKYC: "PendingKYC",
  DocumentSigning: "DocumentSigning",
  Disbursement: "Disbursement",
  Settled: "Settled",
  Active: "Active",
  Pending: "Pending"  // use For Status Chip
}

export const financeApplicationStatusEnum = [
  financeApplicationStatus.Draft,
  financeApplicationStatus.Submitted,
  financeApplicationStatus.Processing,
  financeApplicationStatus.ActionRequired,
  financeApplicationStatus.Review,
  financeApplicationStatus.Approved,
  financeApplicationStatus.ConditionalApproved,
  financeApplicationStatus.Rejected,
  financeApplicationStatus.KIV,
  financeApplicationStatus.PendingKYC,
  financeApplicationStatus.DocumentSigning,
  financeApplicationStatus.Disbursement,
  financeApplicationStatus.Settled,
  financeApplicationStatus.Active,
];

// valid Status For the finance is currently which status for status change
export const validTransitions = {
  [financeApplicationStatus.Draft]: [financeApplicationStatus.Submitted],
  [financeApplicationStatus.Submitted]: [financeApplicationStatus.Review],
  [financeApplicationStatus.Review]: [financeApplicationStatus.ActionRequired, financeApplicationStatus.Processing],
  [financeApplicationStatus.ActionRequired]: [financeApplicationStatus.Submitted],
  [financeApplicationStatus.Processing]: [financeApplicationStatus.Approved, financeApplicationStatus.ConditionalApproved, financeApplicationStatus.Rejected, financeApplicationStatus.KIV],
  [financeApplicationStatus.KIV]: [financeApplicationStatus.Approved, financeApplicationStatus.ConditionalApproved, financeApplicationStatus.Rejected],
  [financeApplicationStatus.Approved]: [financeApplicationStatus.PendingKYC],
  [financeApplicationStatus.ConditionalApproved]: [financeApplicationStatus.PendingKYC, financeApplicationStatus.Approved, financeApplicationStatus.Rejected, financeApplicationStatus.KIV],
  [financeApplicationStatus.PendingKYC]: [financeApplicationStatus.DocumentSigning],
  [financeApplicationStatus.DocumentSigning]: [financeApplicationStatus.Disbursement],
  [financeApplicationStatus.Disbursement]: [financeApplicationStatus.Active],
  [financeApplicationStatus.Active]: [financeApplicationStatus.Settled],
};

export const status: string[] = ["Active", "Pending"];

export const residentialLevel: any[] = [
  {
    value: "Own",
    id: "OWN",
    label: "OWN",
  },
  {
    value: "Rent",
    id: "RENT",
    label: "RENT",
  },
  {
    value: "Parents",
    id: "PARENTS",
    label: "PARENTS",
  },
  {
    value: "Other",
    id: "Other",
    label: "OTHER",
  },
];

export const userStatusEnum = ["Active", "Pending", "Inactive", "Delete"];

export const relationship: any[] = [
  {
    id: "HUSBAND",
    label: "HUSBAND",
  },
  {
    id: "WIFE",
    label: "WIFE",
  },
];

export const qualificationOptions = [
  {
    id: "PRIMARY",
    label: "PRIMARY",
  },
  {
    id: "SECONDARY",
    label: "SECONDARY",
  },
  {
    id: "DIPLOMA",
    label: "DIPLOMA",
  },
  {
    id: "DEGREE",
    label: "DEGREE",
  },
  {
    id: "MASTERS",
    label: "MASTERS",
  },
  {
    id: "DOCTORATE DEGREE",
    label: "DOCTORATE_DEGREE",
  },
  {
    id: "PROFESSOR",
    label: "PROFESSOR",
  },
  {
    id: "Other",
    label: "OTHER",
  },
];

export const acceptFileTypeImageAndPDF = ".pdf, .jpg, .png, .jpeg";

export const acceptFileTypeVideoAndAudio = ".mp3, .mp4, .wav";

export const userType = {
  MiniAgent: "mini-agent",
  Agent: "agent",
  StaffMember: "staffMember",
  Member: "member",
};

export const documentTypeStatusEnum = [
  "Active",
  "Pending",
  "Inactive",
  "Delete",
];

export const contactUsInquiryStatusEnum = [
  "Active",
  "Pending",
  "Inactive",
  "Delete",
];

export const documentSelectType = ["Finance", "Agent", "Admin"];

export const maritalStatusEnum = [
  {
    id: "MARRIED",
    label: "MARRIED",
  },
  {
    id: "SINGLE",
    label: "SINGLE",
  },
  {
    id: "WIDOW",
    label: "WIDOW",
  },
  {
    id: "DIVORCED",
    label: "DIVORCED",
  },
];

// ADD FORM STEP - USE FOR ADD FINANCE, MEMBER, AGENT AND STAFF
export const addFormStep = {
  REGISTER: "REGISTER",
  PRODUCT_DETAILS: "PRODUCT_DETAILS",
  PERSONAL_INFORMATION: "PERSONAL_INFORMATION",
  ADDRESS_INFORMATION: "ADDRESS_INFORMATION",
  DETAILS_OF_SPOUSE: "DETAILS_OF_SPOUSE",
  DETAILS_OF_REFERRALS: "DETAILS_OF_REFERRALS",
  DETAILS_OF_NEXT_OF_KIN: "DETAILS_OF_NEXT_OF_KIN",
  EMPLOYMENT_DETAILS: "EMPLOYMENT_DETAILS",
  INCOME_DETAILS: "INCOME_DETAILS",
  BANKING_DETAILS: "BANKING_DETAILS",
  FINANCING_DETAILS: "FINANCING_DETAILS",
  UPLOAD_DOCUMENTS: "UPLOAD_DOCUMENTS",
};

export const durationRange = {
  minDuration: 1,
  maxDuration: 120,
};

export const moduleName = {
  FinanceApplication: "FinanceApplication",
  StaffMember: "StaffMember",
  Agent: "Agent",
  MiniAgent: "MiniAgent",
  Member: "Member",
};

export const signalRFinanceHubEnum = {
  UpdateUserNotificationCount: "updateUserNotificationCount",
  FinanceApplicationCommunication: "financeApplicationCommunication",
  OneToOneChat: "oneToOneChat",
};

export const downloadCSVFileName = {
  Member: "Finance-Member",
  Agent: "Finance-Agency",
  MiniAgent: "Finance-Regional-Manager",
  StaffMember: "Finance-Staff-Member",
  FinanceApplication: "Finance-Applications",
  FinanceApplicationRepayment: "Finance-Application-Repayments",
};

export const digitalSignatureRole = {
  User: "User",
  Admin: "Admin",
  Lawyer: "Lawyer",
};

export const loginUserRoles = {
  Agent: "agent",
  MiniAgent: "mini-agent",
  Customer: "customer-user",
  Admin: "tenant-admin",
  Lawyer: "lawyer",
  Staff: "staff",
  SuperAdmin: "super-admin"
};