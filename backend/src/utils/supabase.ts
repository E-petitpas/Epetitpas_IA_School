// ========================================
// E-petitpas AI School - Supabase Service
// ========================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseUser } from '../types';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Get auth client for authentication operations
   */
  get auth() {
    return this.client.auth;
  }

  /**
   * Verify JWT token and get user info
   */
  async verifyToken(token: string): Promise<SupabaseUser | null> {
    try {
      const { data: { user }, error } = await this.client.auth.getUser(token);
      
      if (error || !user) {
        console.error('Token verification failed:', error?.message);
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        user_metadata: user.user_metadata || {}
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  /**
   * Get user by ID (admin operation)
   */
  async getUserById(userId: string): Promise<SupabaseUser | null> {
    try {
      const { data: { user }, error } = await this.client.auth.admin.getUserById(userId);
      
      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        user_metadata: user.user_metadata || {}
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Update user metadata (admin operation)
   */
  async updateUserMetadata(userId: string, metadata: any): Promise<boolean> {
    try {
      const { error } = await this.client.auth.admin.updateUserById(userId, {
        user_metadata: metadata
      });

      return !error;
    } catch (error) {
      console.error('Error updating user metadata:', error);
      return false;
    }
  }

  /**
   * Create user (admin operation)
   */
  async createUser(email: string, password: string, metadata: any): Promise<SupabaseUser | null> {
    try {
      const { data: { user }, error } = await this.client.auth.admin.createUser({
        email,
        password,
        user_metadata: metadata,
        email_confirm: true
      });

      if (error || !user) {
        console.error('Error creating user:', error?.message);
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        user_metadata: user.user_metadata || {}
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }
}

// Singleton instance
export const supabaseService = new SupabaseService();