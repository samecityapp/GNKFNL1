import { supabase } from './supabase';
import { Hotel, Group, Tag, PriceTag, SearchTerm } from './types';

export const db = {
  hotels: {
    async getAll(): Promise<Hotel[]> {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getById(id: string): Promise<Hotel | null> {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? this.mapFromDb(data) : null;
    },

    async create(hotel: Omit<Hotel, 'id'>): Promise<Hotel> {
      const { data, error } = await supabase
        .from('hotels')
        .insert([{
          name: hotel.name,
          location: hotel.location,
          description: hotel.about || '',
          price: hotel.price,
          rating: hotel.gnkScore,
          image_url: hotel.coverImageUrl || '',
          amenities: hotel.amenities || [],
          tags: hotel.tags || [],
          about: hotel.about || '',
          about_facility: hotel.aboutFacility || '',
          rules: hotel.rules || '',
          video_url: hotel.videoUrl || '',
          gallery_images: hotel.galleryImages || [],
          latitude: hotel.coordinates?.lat || null,
          longitude: hotel.coordinates?.lng || null
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async update(id: string, updates: Partial<Hotel>): Promise<Hotel> {
      const updateData: any = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.about !== undefined) updateData.about = updates.about;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.gnkScore !== undefined) updateData.rating = updates.gnkScore;
      if (updates.coverImageUrl !== undefined) updateData.image_url = updates.coverImageUrl;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.amenities !== undefined) updateData.amenities = updates.amenities;
      if (updates.aboutFacility !== undefined) updateData.about_facility = updates.aboutFacility;
      if (updates.rules !== undefined) updateData.rules = updates.rules;
      if (updates.videoUrl !== undefined) updateData.video_url = updates.videoUrl;
      if (updates.galleryImages !== undefined) updateData.gallery_images = updates.galleryImages;
      if (updates.coordinates !== undefined) {
        updateData.latitude = updates.coordinates?.lat || null;
        updateData.longitude = updates.coordinates?.lng || null;
      }

      const { data, error } = await supabase
        .from('hotels')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('hotels')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async hardDelete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async restore(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('hotels')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async search(filters: {
      searchTerm?: string;
      tags?: string[];
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
    }): Promise<Hotel[]> {
      let query = supabase
        .from('hotels')
        .select('*');

      if (filters.searchTerm) {
        query = query.textSearch('search_vector', filters.searchTerm, {
          type: 'websearch',
          config: 'simple'
        });
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.minRating !== undefined) {
        query = query.gte('rating', filters.minRating);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getByTag(tag: string): Promise<Hotel[]> {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .contains('tags', [tag])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getByPriceRange(minPrice: number, maxPrice: number): Promise<Hotel[]> {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .gte('price', minPrice)
        .lte('price', maxPrice)
        .order('price', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    mapFromDb(row: any): Hotel {
      return {
        id: row.id,
        name: row.name,
        location: row.location,
        gnkScore: row.rating || 0,
        price: row.price,
        about: row.about || '',
        tags: row.tags || [],
        amenities: row.amenities || [],
        coverImageUrl: row.image_url || '',
        galleryImages: row.gallery_images || [],
        aboutFacility: row.about_facility || '',
        rules: row.rules || '',
        coordinates: row.latitude && row.longitude
          ? { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) }
          : undefined,
        videoUrl: row.video_url || '',
        video_url: row.video_url || '',
        video_thumbnail_url: row.video_thumbnail_url || '',
        website_url: row.website_url || '',
        instagram_url: row.instagram_url || '',
        google_maps_url: row.google_maps_url || '',
        how_to_get_there: row.how_to_get_there || ''
      };
    }
  },

  groups: {
    async getAll(): Promise<Group[]> {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getPublished(): Promise<Group[]> {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getPublishedWithHotels(): Promise<any[]> {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          title,
          group_hotels (
            order_index,
            hotels (
              id,
              name,
              location,
              price,
              rating,
              image_url
            )
          )
        `)
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const sortedGroups = (data || []).map(group => ({
        id: group.id,
        title: group.title,
        hotels: (group.group_hotels || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((gh: any) => gh.hotels)
          .filter(Boolean)
          .map((hotel: any) => ({
            id: hotel.id,
            name: hotel.name,
            location: hotel.location,
            price: hotel.price,
            gnkScore: hotel.rating || 0,
            coverImageUrl: hotel.image_url || ''
          }))
      }));

      return sortedGroups;
    },

    async getById(id: string): Promise<Group | null> {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? this.mapFromDb(data) : null;
    },

    async getHotels(groupId: string): Promise<string[]> {
      const { data, error } = await supabase
        .from('group_hotels')
        .select('hotel_id')
        .eq('group_id', groupId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => row.hotel_id);
    },

    async create(group: Omit<Group, 'id'>, hotelIds: string[] = []): Promise<Group> {
      const { data, error } = await supabase
        .from('groups')
        .insert([{
          title: group.title,
          is_published: group.isPublished
        }])
        .select()
        .single();

      if (error) throw error;

      if (hotelIds.length > 0) {
        await this.setHotels(data.id, hotelIds);
      }

      return this.mapFromDb(data);
    },

    async update(id: string, updates: Partial<Group>): Promise<Group> {
      const updateData: any = {};

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('groups')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async setHotels(groupId: string, hotelIds: string[]): Promise<void> {
      await supabase
        .from('group_hotels')
        .delete()
        .eq('group_id', groupId);

      if (hotelIds.length > 0) {
        const inserts = hotelIds.map((hotelId, index) => ({
          group_id: groupId,
          hotel_id: hotelId,
          order_index: index
        }));

        const { error } = await supabase
          .from('group_hotels')
          .insert(inserts);

        if (error) throw error;
      }
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('groups')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async hardDelete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async restore(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('groups')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    mapFromDb(row: any): Group {
      return {
        id: row.id,
        title: row.title,
        isPublished: row.is_published,
        hotelIds: []
      };
    }
  },

  tags: {
    async getAll(): Promise<Tag[]> {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getFeatured(): Promise<Tag[]> {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('is_featured', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getBySlug(slug: string): Promise<Tag | null> {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data ? this.mapFromDb(data) : null;
    },

    async create(tag: Omit<Tag, 'id'>): Promise<Tag> {
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: tag.name,
          slug: tag.slug,
          icon: tag.icon || 'Tag',
          is_featured: tag.isFeatured || false
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async update(id: string, updates: Partial<Tag>): Promise<Tag> {
      const updateData: any = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.slug !== undefined) updateData.slug = updates.slug;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;

      const { data, error } = await supabase
        .from('tags')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('tags')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async hardDelete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async restore(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('tags')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    mapFromDb(row: any): Tag {
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        icon: row.icon,
        isFeatured: row.is_featured
      };
    }
  },

  priceTags: {
    async getAll(): Promise<PriceTag[]> {
      const { data, error } = await supabase
        .from('price_tags')
        .select('*')
        .order('min_price', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getBySlug(slug: string): Promise<PriceTag | null> {
      const { data, error } = await supabase
        .from('price_tags')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data ? this.mapFromDb(data) : null;
    },

    async create(priceTag: Omit<PriceTag, 'id'>): Promise<PriceTag> {
      const { data, error } = await supabase
        .from('price_tags')
        .insert([{
          label: priceTag.label,
          slug: priceTag.slug,
          min_price: priceTag.minPrice,
          max_price: priceTag.maxPrice
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async update(id: string, updates: Partial<PriceTag>): Promise<PriceTag> {
      const updateData: any = {};

      if (updates.label !== undefined) updateData.label = updates.label;
      if (updates.slug !== undefined) updateData.slug = updates.slug;
      if (updates.minPrice !== undefined) updateData.min_price = updates.minPrice;
      if (updates.maxPrice !== undefined) updateData.max_price = updates.maxPrice;

      const { data, error } = await supabase
        .from('price_tags')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('price_tags')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async hardDelete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('price_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async restore(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('price_tags')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    mapFromDb(row: any): PriceTag {
      return {
        id: row.id,
        label: row.label,
        slug: row.slug,
        minPrice: row.min_price,
        maxPrice: row.max_price
      };
    }
  },

  searchTerms: {
    async getAll(): Promise<SearchTerm[]> {
      const { data, error } = await supabase
        .from('search_terms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDb);
    },

    async getBySlug(slug: string): Promise<SearchTerm | null> {
      const { data, error } = await supabase
        .from('search_terms')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data ? this.mapFromDb(data) : null;
    },

    async create(searchTerm: Omit<SearchTerm, 'id'>): Promise<SearchTerm> {
      const { data, error } = await supabase
        .from('search_terms')
        .insert([{
          term: searchTerm.term,
          slug: searchTerm.slug
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async update(id: string, updates: Partial<SearchTerm>): Promise<SearchTerm> {
      const updateData: any = {};

      if (updates.term !== undefined) updateData.term = updates.term;
      if (updates.slug !== undefined) updateData.slug = updates.slug;

      const { data, error } = await supabase
        .from('search_terms')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDb(data);
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('search_terms')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async hardDelete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('search_terms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    async restore(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('search_terms')
        .update({ deleted_at: null })
        .eq('id', id);

      if (error) throw error;
      return true;
    },

    mapFromDb(row: any): SearchTerm {
      return {
        id: row.id,
        term: row.term,
        slug: row.slug
      };
    }
  },

  articles: {
    async getAllByLocation(location: string) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('location', location)
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async getBySlug(slug: string) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    async getLatest(limit: number = 3) {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, cover_image_url')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }
  }
};
