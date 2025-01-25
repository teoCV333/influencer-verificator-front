export interface InfluencersResponse {
  status: {
    code: number;
    message: string;
  };
  data: Influencer[] | any;
}

export interface InfluencerResponse {
  status: {
    code: number;
    message: string;
  };
  data: Influencer | any;
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

export interface Claim {
  claimText: string;
  datePosted: string; // Consider using Date type if converting to Date object
  postUrl: string;
  categories: string[];
  verificationStatus: string;
  sources: ClaimSource[];
  _id: string;
}

export interface ClaimSource {
  url: string;
  title: string;
  _id: string;
}
