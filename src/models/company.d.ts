// Interface describes Company data model
export interface Company {
  companyId: string;
  name: string;
  auroraUrl: string;
  avatarColor: string;
  status: string;
  isDeleted: boolean;
  createdBy?: Date;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  auroraUrl?: string;
  logoFileId?: string;
  website?: string;
  language?: string;
  joinDate?: string;
  paidSubscriptionStartDate?: Date;
  contactName?: string;
  phone?: string;
  email?: string;
  description?: string;

  // Expanded fields
  signedLogo: {
    fileId: string;
    profileId: string;
    fileName: string;
    thumbnails: any;
  };
}

interface CompanyMenu {
  path: string;
  name: string;
  iconColor?: string;
  icon?: IconDefinition;
  avatarColor?: string;
}
