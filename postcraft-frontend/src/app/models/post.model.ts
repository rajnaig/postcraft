// src/app/models/post.model.ts
export interface GeneratePostRequest {
  message: string;
  audience: string;
  vibe: string;
  style: string;
  use_emojis: boolean;
  platforms: string[];
  ab_testing: boolean;
  include_scheduling: boolean;
}

export interface PostVersion {
  id: string;
  text: string;
  hashtags: string[];
  image_suggestions?: string[];
}

export interface PlatformTips {
  optimal_posting_time?: string;
  character_count: number;
}

export interface PlatformPost {
  versions: PostVersion[];
  tips: PlatformTips;
}

export interface GeneratePostResponse {
  request_id: string;
  generated_at: string;
  posts: {
    [platform: string]: PlatformPost;
  };
}

export interface PlatformConfig {
  id: string;
  name: string;
  char_limit: number;
  image_size: string;
  hashtag_limit: number;
}

export interface OptionItem {
  id: string;
  name: string;
  description: string;
}

export interface PlatformsResponse {
  platforms: PlatformConfig[];
}

export interface OptionsResponse {
  vibe_options: OptionItem[];
  style_options: OptionItem[];
}

export interface Profile {
  id: number;
  name: string;
  description?: string;
  settings: any;
  created_at: string;
  updated_at: string;
}
