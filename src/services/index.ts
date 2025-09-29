// Firebase Auth Service
export { firebaseAuthService, FirebaseAuthService } from './firebase-auth';

// GitHub API Service
export { githubApiService } from './github-api';

// Service types
export type { AuthUser, LoginResult } from '../types/auth.types';
export type {
  GitHubGist,
  GitHubGistResponse,
  GistCreateData,
  GistUpdateData,
  GitHubUser,
} from '../types/github.types';
