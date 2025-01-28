export interface ClaimSource {
  url: string;
  title: string;
  _id: string;
}

export interface Claim {
  claimText: string;
  datePosted: string; // Consider using Date type if converting to Date object
  postUrl: string;
  categories: string[];
  verificationStatus: string;
  sources: ClaimSource[];
  _id: string;
}

export interface Influencer {
  _id: string;
  name: string;
  contentCategories: string[];
  description: string;
  quantityFollowers: number;
  claims: Claim[];
  score: number;
  __v: number;
}

export interface InfluencersResponse {
  success: boolean;
  data: Influencer[];
  message: string;
}

export interface InfluencerResponse {
  success: boolean;
  data: Influencer;
  message: string;
}

