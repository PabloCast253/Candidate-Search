// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
    login(login: any): unknown;
    avatar_url: string | undefined;
    name: string;
    username: string;
    location: string;
    avatar: string;
    email?: string;
    html_url: string;
    company?: string;
  }