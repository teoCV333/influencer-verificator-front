export interface Influencer {
    _id: string;
    name: string;
    description: string;
    categories: string[];
    totalAverageFollowers: number;
    trustScore: number;
    claims: string[]; // specify the claims model interface
}