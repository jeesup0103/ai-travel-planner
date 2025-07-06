export interface Message {
    id: string;
    chatSessionId: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }

  export interface ChatSession {
    id: string;
    title: string;
    timestamp: Date;
    messages: Message[];
  }

  export interface Location {
    lat: number;
    lng: number;
    name: string;
  }

  export interface Route {
    origin: string;
    destination: string;
    distance: string;
    duration:string;
    mode: string;
  }
  export interface Place  {
    name: string;
    address: string;
    rating: number;
    lat?: number;
    lng?: number;
  }
  export interface LatLng {
    lat: number;
    lng: number;
  }
  export interface Recommendation {
    query: string;
    routes: Route[];
    places: Place[];
    tips: string[];
    summaryResponse: string;
  }
  export interface ChatResponse {
    recommendation: Recommendation;
  }
