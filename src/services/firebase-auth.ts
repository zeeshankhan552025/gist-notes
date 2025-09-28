import { signInWithPopup, signOut, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubToken?: string;
}

export class FirebaseAuthService {
  private provider: GithubAuthProvider;

  constructor() {
    this.provider = new GithubAuthProvider();
    // Add the 'gist' scope for GitHub API access
    this.provider.addScope("gist");
    this.provider.addScope("read:user");
    this.provider.addScope("public_repo");
    
    // Set custom parameters to ensure we get an access token
    this.provider.setCustomParameters({
      'allow_signup': 'true'
    });
  }

  /**
   * Login with GitHub using Firebase Auth
   */
  async loginWithGithub(): Promise<{ user: AuthUser; token: string } | null> {
    try {
      const result = await signInWithPopup(auth, this.provider);
      
      // Get the GitHub access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (!token) {
        throw new Error("Failed to get GitHub access token from credential");
      }

      // Store token in localStorage
      this.storeToken(token);

      // Create AuthUser object
      const authUser: AuthUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        githubToken: token
      };
      // Store user info in localStorage as well
      this.storeUserInfo(authUser);

      return { user: authUser, token };

    } catch (error: any) {
      // Handle different error types
      const errorCode = error.code;
      const errorMessage = error.message;
      
      // The email of the user's account used.
      const email = error.customData?.email;
      
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      
      throw error;
    }
  }


  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.clearStoredData();
    } catch (error) {
      throw error;
    }
  }


  /**
   * Get the current user's authentication state
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Store GitHub token in localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem("github_token", token);
  }

  /**
   * Get stored GitHub token from localStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem("github_token");
  }

  /**
   * Store user info in localStorage
   */
  private storeUserInfo(user: AuthUser): void {
    localStorage.setItem("user_info", JSON.stringify(user));
  }

  /**
   * Get stored user info from localStorage
   */
  getStoredUserInfo(): AuthUser | null {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Clear all stored authentication data
   */
  private clearStoredData(): void {
    localStorage.removeItem("github_token");
    localStorage.removeItem("user_info");
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getStoredToken();
  }

  /**
   * Get GitHub API headers with authorization
   */
  getGitHubApiHeaders(): Record<string, string> {
    const token = this.getStoredToken();
    
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
    
    return headers;
  }
}

// Create and export a singleton instance
export const firebaseAuthService = new FirebaseAuthService();