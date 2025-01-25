import { Injectable, Logger } from '@nestjs/common';
import {
  CommentPostDTO,
  GetAssetDetailResDTO,
  GetAssetsDTO,
  GetPortfolioResDTO,
  GetPostResDTO,
  GetQuizesResDTO,
  GetTournamentsDTO,
  JoinQuizDTO,
  JoinTournamentDTO,
  LikePostDTO,
  LoginPayloadDTO,
  LoginResDTO,
  Post,
  Quiz,
  SeedsUserResDTO,
  SellDTO,
  Tournament,
} from '../dto/seeds.dto';
import { SeedsUserDTO } from '../dto/user.dto';

@Injectable()
export class SeedsRepository {
  private seedsURL = 'https://app.seeds.finance';

  constructor(private readonly logger: Logger) {}

  getUserToken = async (user: SeedsUserDTO): Promise<LoginResDTO | null> => {
    try {
      const { phoneNumber, password } = user;
      const payload: LoginPayloadDTO = {
        phoneNumber,
        password,
        platform: 'desktop_web',
        os_name: 'Mac',
      };
      const response = await fetch(
        `${this.seedsURL}/auth/v1/login/phone-number`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );
      if (response.status !== 200) return null;
      const result: LoginResDTO = await response.json();
      return result;
    } catch (error) {
      this.logger.error('error getUserToken: ', error);
      return null;
    }
  };

  getUser = async (loginData: LoginResDTO) => {
    try {
      const response = await fetch(`${this.seedsURL}/user/v1/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginData.accessToken}`,
        },
      });
      if (response.status !== 200) return null;
      const result: SeedsUserResDTO = await response.json();
      return result;
    } catch (error) {
      this.logger.error('error getUser: ', error);
      return null;
    }
  };

  getPosts = async (loginData: LoginResDTO) => {
    try {
      const response = await fetch(
        `${this.seedsURL}/post/v2/list/for-you?page=1&limit=20&type=all&sort_by=`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        },
      );
      const result: GetPostResDTO = await response.json();
      return result.data;
    } catch (error) {
      this.logger.error('error getPosts: ', error);
      return null;
    }
  };

  likePost = (loginData: LoginResDTO, post: Post) => {
    const payload: LikePostDTO = {
      post_id: post.id,
      type: 1,
    };
    return fetch(`${this.seedsURL}/post/rating/v2/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  };

  commentPost = (loginData: LoginResDTO, post: Post, userId: string) => {
    const replies = [
      'Mantap',
      'Mantuls',
      'Ya',
      'Hmmm',
      'Halooooow',
      'Keren',
      'Menariiiik',
      'Masa sih?',
      'Hahahaha',
      'Hehehehe',
    ];
    const payload: CommentPostDTO = {
      content_text: replies[this.randomIndex(replies.length)],
      media_url: '',
      user_id: userId,
      post_id: post.id,
      parent_id: '',
      media_type: '',
    };
    return fetch(`${this.seedsURL}/post/comment/v2/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  };

  jobPost = async (loginData: LoginResDTO, user: SeedsUserResDTO) => {
    const posts = await this.getPosts(loginData);
    const postForLike = posts[this.randomIndex(posts.length)];
    const postForComment = posts[this.randomIndex(posts.length)];

    const likePost = await this.likePost(loginData, postForLike);
    this.logger.log(
      `✅ ${user.phoneNumber} likePost ${postForLike.content_text}: ${likePost.status}`,
    );

    const commentPost = await this.commentPost(
      loginData,
      postForComment,
      user.id,
    );
    this.logger.log(
      `✅ ${user.phoneNumber} commentPost ${postForLike.content_text}: ${commentPost.status}`,
    );
  };

  getQuizes = async (loginData: LoginResDTO) => {
    try {
      const response = await fetch(
        `${this.seedsURL}/quiz/v1/all?search=&status=STARTED&page=1&limit=20&currency=IDR`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        },
      );
      const result: GetQuizesResDTO = await response.json();
      return result.data;
    } catch (error) {
      this.logger.error('error getQuizes: ', error);
      return null;
    }
  };

  joinQuiz = (loginData: LoginResDTO, user: SeedsUserResDTO, quiz: Quiz) => {
    const payload: JoinQuizDTO = {
      quiz_id: quiz.id,
      lifelines: ['PHONE'],
      language: 'en',
      payment_gateway: '',
      payment_method: '',
      phone_number: user.phoneNumber,
      promo_code: '',
      invitation_code: 'undefined',
      is_use_coins: false,
    };

    return fetch(`${this.seedsURL}/quiz/v1/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  };

  startQuiz = async (loginData: LoginResDTO, quiz: Quiz) => {
    return fetch(`${this.seedsURL}/quiz/v1/${quiz.id}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.accessToken}`,
      },
      body: JSON.stringify({ platform: 'WEB' }),
    });
  };

  jobQuiz = async (loginData: LoginResDTO, userData: SeedsUserResDTO) => {
    const quizes = await this.getQuizes(loginData);
    const freeQuizes = quizes.filter((item) => item.admission_fee === 0);
    const selectedQuiz = freeQuizes[this.randomIndex(freeQuizes.length)];
    const joinQuiz = await this.joinQuiz(loginData, userData, selectedQuiz);
    this.logger.log(
      `✅ ${userData.phoneNumber} joinQuiz ${selectedQuiz.name}: ${joinQuiz.status}`,
    );
    const startQuiz = await this.startQuiz(loginData, selectedQuiz);
    this.logger.log(
      `✅ ${userData.phoneNumber} startQuiz ${selectedQuiz.name}: ${startQuiz.status}`,
    );
  };

  getTournaments = async (
    loginData: LoginResDTO,
    type: 'JOINED' | 'ACTIVE',
  ) => {
    try {
      const response = await fetch(
        `${this.seedsURL}/play/v1/list?search=&status=${type}&limit=20&page=1&sort_by=&totalPage=0`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        },
      );
      const result: GetTournamentsDTO = await response.json();
      return result.playList;
    } catch (error) {
      this.logger.error('error getTournaments: ', error);
      return null;
    }
  };

  joinTournament = async (loginData: LoginResDTO, tournament: Tournament) => {
    const payload: JoinTournamentDTO = {
      play_id: tournament.id,
      currency: 'IDR',
      payment_gateway: '',
      payment_method: '',
      phone_number: '',
      promo_code: '',
      invitation_code: '',
      is_use_coins: false,
      success_url: '',
      cancel_url: '',
    };

    return fetch(`${this.seedsURL}/play/v1/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  };

  getAssets = async (loginData: LoginResDTO, tournament: Tournament) => {
    try {
      const response = await fetch(
        `${this.seedsURL}/market/v1/list?search=&limit=10&page=1&currency=IDR&sort_by=alphabet_asc&type=${tournament.category}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        },
      );
      const result: GetAssetsDTO = await response.json();
      return result.marketAssetList;
    } catch (error) {
      this.logger.error('error getAssets: ', error);
      return null;
    }
  };

  getPortfolio = async (loginData: LoginResDTO, tournament: Tournament) => {
    try {
      const response = await fetch(
        `${this.seedsURL}/play/v1/assets/active?play_id=${tournament.id}&per_page=5&page=1&currency=IDR`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        },
      );
      const result: GetPortfolioResDTO = await response.json();
      return result.data;
    } catch (error) {
      this.logger.error('error getPortfolio: ', error);
      return null;
    }
  };

  getCurrentAsset = async (
    loginData: LoginResDTO,
    tournament: Tournament,
    assetId: string,
  ) => {
    try {
      const response = await fetch(
        `${this.seedsURL}/play/v1/${tournament.id}/assets/${assetId}?currency=IDR`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        },
      );
      const result: GetAssetDetailResDTO = await response.json();
      return result.data;
    } catch (error) {
      this.logger.error('error getCurrentAsset: ', error);
      return null;
    }
  };

  sellOrBuyAsset = (
    loginData: LoginResDTO,
    tournament: Tournament,
    assetId: string,
    type: 'SELL' | 'BUY',
  ) => {
    const payload: SellDTO = {
      asset_id: assetId,
      amount: 1,
      type,
    };

    return fetch(`${this.seedsURL}/play/v1/${tournament.id}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  };

  jobTournament = async (loginData: LoginResDTO, userData: SeedsUserResDTO) => {
    const joinedTournament = await this.getTournaments(loginData, 'JOINED');
    let selectedTournament: Tournament | null = null;
    if (joinedTournament.length > 0) {
      const activeTournament = joinedTournament.filter(
        (item) => item.status === 'ACTIVE',
      );
      selectedTournament =
        activeTournament[this.randomIndex(activeTournament.length)];
    } else {
      const availableTournament = await this.getTournaments(
        loginData,
        'ACTIVE',
      );
      const freeTournament = availableTournament.filter(
        (item) => !item.is_need_invitation_code && item.admission_fee === 0,
      );
      selectedTournament =
        freeTournament[this.randomIndex(freeTournament.length)];
      await this.joinTournament(loginData, selectedTournament);
    }
    const portfolio = await this.getPortfolio(loginData, selectedTournament);
    if (portfolio.length > 0) {
      const asset = await this.getCurrentAsset(
        loginData,
        selectedTournament,
        portfolio[0].asset_id,
      );
      const sellAsset = await this.sellOrBuyAsset(
        loginData,
        selectedTournament,
        asset.asset_id,
        'SELL',
      );
      this.logger.log(
        `✅ ${userData.phoneNumber} sellAsset ${selectedTournament.name} ${asset.real_ticker}: ${sellAsset.status}`,
      );
    } else {
      const assets = await this.getAssets(loginData, selectedTournament);
      const ordered = assets.sort(
        (prev, next) => prev.priceBar.close - next.priceBar.close,
      );
      const buyAsset = await this.sellOrBuyAsset(
        loginData,
        selectedTournament,
        ordered[0].id,
        'BUY',
      );
      this.logger.log(
        `✅ ${userData.phoneNumber} buyAsset ${selectedTournament.name} ${ordered[0].realTicker}: ${buyAsset.status}`,
      );
    }
  };

  activityJob = async (user: SeedsUserDTO) => {
    try {
      const loginData = await this.getUserToken(user);
      const userData = await this.getUser(loginData);

      await this.jobPost(loginData, userData);
      await this.jobQuiz(loginData, userData);
      await this.jobTournament(loginData, userData);
    } catch (error) {
      this.logger.error(error);
    }
  };

  randomIndex = (length: number) => Math.floor(Math.random() * length);
}
