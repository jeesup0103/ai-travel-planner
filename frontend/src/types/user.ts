export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: string;
  preferences?: {
    favoriteLocations?: string[];
    travelPreferences?: string[];
  };
}