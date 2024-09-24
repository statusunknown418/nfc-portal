export {};

declare global {
  interface CustomJwtSessionClaims {
    firstName?: string;
    lastName?: string;
    image?: string;
    username: string;
    userId: string;
    email: string;
  }
}
