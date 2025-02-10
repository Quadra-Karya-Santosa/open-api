import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export interface LoginPayloadDTO {
  phoneNumber: string;
  password: string;
  platform: string;
  os_name: string;
}

export interface LoginResDTO {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  needResetPassword: boolean;
  needSetPassword: boolean;
}
export interface getArticleResDTO {
  data: ArticleI[];
  metadata: Metadata;
}
export interface ArticleI {
  id: number;
  title: string;
  author: string;
  author_id: string;
  link: string;
  videoUrl: string;
  imageUrl: string;
  content: string;
  source: string;
  language: string;
  category: string;
  publicationDate: string;
  peoples: any[];
  circles: any[];
  assets: any[];
  status: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  is_liked: boolean;
  meta_title: string;
  meta_description: string;
  updated_at: string;
}

export interface GetPostResDTO {
  data: Post[];
  metadata: Metadata;
}

export interface Post {
  id: string;
  content_text: string;
  media_urls?: string[];
  privacy: string;
  is_pinned: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  circle_id: string;
  play_id: string;
  quiz_id: string;
  hashtags?: string[];
  owner: Owner;
  pie_title: string;
  pie_amount: number;
  pie: any[];
  total_comment: number;
  total_polling: number;
  total_upvote: number;
  total_downvote: number;
  status_like: boolean;
  status_unlike: boolean;
  status_saved: boolean;
  parent_id: string;
  polling_date: string;
  polling_multiple: boolean;
  polling_new_option: boolean;
  slug: string;
  premium_fee: number;
  status_payment: boolean;
  is_followed: boolean;
}

export interface Owner {
  avatar: string;
  label: string;
  name: string;
  seeds_tag: string;
  verified: boolean;
}

export interface Metadata {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
}

export interface LikePostDTO {
  post_id: string;
  type: number;
}

export interface CommentPostDTO {
  content_text: string;
  media_url: string;
  user_id: string;
  post_id: string;
  parent_id: string;
  media_type: string;
}

export interface SeedsUserResDTO {
  id: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  name: string;
  seedsTag: string;
  refCode: string;
  avatar: string;
  preferredLanguage: string;
  preferredCurrency: string;
  bio: string;
  pin: boolean;
  followers: number;
  following: number;
  posts: number;
  region: string;
  verified: boolean;
  email_verification: boolean;
  badge: string;
  refCodeUsage: number;
  label: string;
  currentExp: number;
  isPasswordExists: boolean;
}

export interface GetQuizesResDTO {
  data: Quiz[];
  meta: MetaQuiz;
}

export interface Quiz {
  id: string;
  quiz_unique_id: string;
  name: string;
  banner: Banner;
  questions: number;
  participants: number;
  category: string;
  status: string;
  privacy: string;
  featured_link: string;
  admission_fee: number;
  is_played: boolean;
  is_recommended: boolean;
  is_free_voucher_claimed: boolean;
  started_at: string;
  ended_at: string;
  company_id: string;
  created_at: string;
}

export interface Banner {
  image_link: string;
  image_url: string;
}

export interface MetaQuiz {
  page: number;
  per_page: number;
  total: number;
}

export interface JoinQuizDTO {
  quiz_id: string;
  lifelines: string[];
  language: string;
  payment_gateway: string;
  payment_method: string;
  phone_number: string;
  promo_code: string;
  invitation_code: string;
  is_use_coins: boolean;
}

export interface GetTournamentsDTO {
  playList: Tournament[];
  metadata: Metadata;
}

export interface Tournament {
  id: string;
  play_id: string;
  name: string;
  category: string;
  all_category: string[];
  type: string;
  publish_time: string;
  open_registration_time: string;
  play_time: string;
  end_time: string;
  min_participant: number;
  max_participant: number;
  currency: string;
  opening_balance: number;
  admission_fee: number;
  fee_percentage: number;
  winners?: string[];
  gain_percentage: number;
  prize_fix_amount: number;
  prize_fix_percentages: number[];
  prize_pool_amount: number;
  prize_pool_percentages: number[];
  is_joined: boolean;
  created_by_user_id: string;
  created_by_admin_id: string;
  status: string;
  tnc: string;
  banner: string;
  rank: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
  featured_link: string;
  reward_url: string;
  promo_id: string;
  is_need_invitation_code: boolean;
  raw_asset_sub_type?: string[];
  payment_method: string[];
  is_free_voucher_claimed: boolean;
}

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

export interface JoinTournamentDTO {
  play_id: string;
  currency: string;
  payment_gateway: string;
  payment_method: string;
  phone_number: string;
  promo_code: string;
  invitation_code: string;
  is_use_coins: boolean;
  success_url: string;
  cancel_url: string;
}

export interface GetAssetsDTO {
  marketAssetList: AssetI[];
  metadata: MetaAsset;
}

export interface AssetI {
  id: string;
  seedsTicker: string;
  realTicker: string;
  logo: string;
  name: string;
  exchange: string;
  exchangeCurrency: string;
  listedCountry: string;
  createdAt: string;
  updatedAt: string;
  assetType: string;
  exchangeRate: number;
  assetSubType?: string[];
  priceBar: PriceBar;
}

export interface PriceBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vwap: number;
  volume: number;
}

export interface MetaAsset {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

export interface GetPortfolioResDTO {
  data: Portfolio[];
  metadata: MetaPortfolio;
}

export interface Portfolio {
  id: string;
  play_id: string;
  user_id: string;
  asset_id: string;
  currency: string;
  total_lot: number;
  average_price: number;
  return_percentage: number;
  created_at: string;
  updated_at: string;
  asset_detail: AssetDetail;
}

export interface AssetDetail {
  seeds_ticker: string;
  real_ticker: string;
  logo: string;
  name: string;
  description: string;
  exchange: string;
  exchange_currency: string;
  listed_country: string;
  asset_type: string;
}

export interface MetaPortfolio {
  page: number;
  per_page: number;
  total: number;
}

export interface GetAssetDetailResDTO {
  data: AssetDetail;
}

export interface AssetDetail {
  asset_id: string;
  play_id: string;
  user_id: string;
  total_lot: number;
  average_price: number;
  current_price: number;
  total_invested: number;
  total_value: number;
  return_value: number;
  return_percentage: number;
  currency: string;
}

export interface SellDTO {
  asset_id: string;
  amount: number;
  type: string;
}

export class ChatDTO {
  @ApiProperty({ type: 'string', default: 'body message' })
  @IsString()
  message: string;
}

export class RegisterTelegramDTO {
  @ApiProperty({ type: 'number', default: 123412 })
  @IsNumber()
  chatId: number;

  @ApiProperty({ type: 'string', default: 'Willy' })
  @IsString()
  name: string;
}

export interface GetListUserDTO {
  result: ResultUser[];
}

export interface ResultUser {
  id: string;
  avatar: string;
  rank: number;
  name: string;
  seedsTag: string;
  followers: number;
  followings: number;
  isFollowed: boolean;
}
