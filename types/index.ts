export interface FoodTrendData {
  id: string;
  slug: string;
  name: string;
  description: string;
  inventorName: string;
  imageUrl: string;
  trendStartYear: number;
  trendStartMonth: number;
  status: 'active' | 'cooling' | 'archived';
  sortOrder: number;
  visible: boolean;
  stores: StoreSubmissionData[];
}

export interface StoreSubmissionData {
  id: string;
  foodTrendId: string;
  sourceUrl: string;
  sourcePlatform: string;
  storeName: string;
  address: string | null;
  businessHours: string | null;
  thumbnailUrl: string | null;
  moderationStatus: string;
  createdAt: string;
}

export type SubmitStoreResult =
  | { success: true; store: StoreSubmissionData }
  | { success: false; error: string };

export type ToastState = {
  type: 'success' | 'error';
  message: string;
} | null;

export interface AdminTrendForm {
  name: string;
  slug: string;
  description: string;
  inventorName: string;
  imageUrl: string;
  trendStartYear: number;
  trendStartMonth: number;
  status: 'active' | 'cooling' | 'archived';
  sortOrder: number;
  visible: boolean;
}
