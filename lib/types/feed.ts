export type FeedCategory = {
  id: string;
  name: string;
  slug: string;
};

export type FeedTag = {
  id: string;
  name: string;
  slug: string;
};

export type FeedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  categories?: FeedCategory | null;
  tags?: FeedTag[];
};
