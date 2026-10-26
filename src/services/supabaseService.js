import { supabase, isSupabaseConfigured } from './supabaseClient';
import { sampleReports } from '../data/initialData';

export const supabaseService = {
  isConfigured() {
    return isSupabaseConfigured();
  },

  /**
   * Fetch all reports from Supabase.
   * If table is empty, auto-seeds with initial sample data!
   */
  async getReports() {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error (falling back to LocalStorage):', error.message);
        return null;
      }

      // If data exists, format it to match app structure
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          type: row.type,
          title: row.title,
          category: row.category,
          status: row.status,
          image: row.image,
          description: row.description,
          city: row.city,
          district: row.district,
          locationAddress: row.location_address || row.locationAddress,
          coordinates: row.coordinates,
          date: row.date,
          time: row.time,
          reward: row.reward,
          contactPreference: row.contact_preference || row.contactPreference,
          custodyLocation: row.custody_location || row.custodyLocation,
          secretQuestion: row.secret_question || row.secretQuestion,
          userId: row.user_id || row.userId,
          reporterName: row.reporter_name || row.reporterName,
          reporterAvatar: row.reporter_avatar || row.reporterAvatar,
          viewsCount: row.views_count || 1,
          createdAt: row.created_at,
        }));
      }

      // If table exists but is empty, seed it with sample reports
      if (data && data.length === 0) {
        await this.seedInitialReports();
        return sampleReports;
      }

      return null;
    } catch (err) {
      console.warn('Supabase connection failed:', err);
      return null;
    }
  },

  /**
   * Insert a new report into Supabase
   */
  async createReport(report) {
    if (!supabase) return null;

    try {
      const dbRow = {
        id: report.id,
        type: report.type,
        title: report.title,
        category: report.category,
        status: report.status || 'open',
        image: report.image,
        description: report.description,
        city: report.city,
        district: report.district || '',
        location_address: report.locationAddress || '',
        coordinates: report.coordinates || null,
        date: report.date,
        time: report.time || '',
        reward: report.reward || null,
        contact_preference: report.contactPreference || 'in_app_chat',
        custody_location: report.custodyLocation || null,
        secret_question: report.secretQuestion || '',
        user_id: report.userId || 'user-azizbek',
        reporter_name: report.reporterName || 'Azizbek Rakhimov',
        reporter_avatar: report.reporterAvatar || '',
        views_count: report.viewsCount || 1,
      };

      const { data, error } = await supabase.from('reports').insert([dbRow]).select();
      if (error) {
        console.warn('Supabase insert error:', error.message);
        return null;
      }
      return data?.[0] || report;
    } catch (err) {
      console.warn('Supabase createReport exception:', err);
      return null;
    }
  },

  /**
   * Update an existing report in Supabase
   */
  async updateReport(id, patch) {
    if (!supabase) return null;

    try {
      const updateData = {};
      if (patch.title !== undefined) updateData.title = patch.title;
      if (patch.status !== undefined) updateData.status = patch.status;
      if (patch.description !== undefined) updateData.description = patch.description;
      if (patch.locationAddress !== undefined) updateData.location_address = patch.locationAddress;
      if (patch.reward !== undefined) updateData.reward = patch.reward;

      const { data, error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.warn('Supabase update error:', error.message);
        return null;
      }
      return data?.[0] || null;
    } catch (err) {
      console.warn('Supabase updateReport exception:', err);
      return null;
    }
  },

  /**
   * Delete report from Supabase
   */
  async deleteReport(id) {
    if (!supabase) return false;

    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase deleteReport exception:', err);
      return false;
    }
  },

  /**
   * Seed sample data into Supabase
   */
  async seedInitialReports() {
    if (!supabase) return;

    try {
      const formatted = sampleReports.map((r) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        category: r.category,
        status: r.status,
        image: r.image,
        description: r.description,
        city: r.city,
        district: r.district,
        location_address: r.locationAddress,
        coordinates: r.coordinates,
        date: r.date,
        time: r.time,
        reward: r.reward,
        contact_preference: r.contactPreference,
        custody_location: r.custodyLocation,
        secret_question: r.secretQuestion,
        user_id: r.userId,
        reporter_name: r.reporterName,
        reporter_avatar: r.reporterAvatar,
        views_count: r.viewsCount,
      }));

      await supabase.from('reports').upsert(formatted);
    } catch (err) {
      console.warn('Failed to seed Supabase reports:', err);
    }
  },
};
