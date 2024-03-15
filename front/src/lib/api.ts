import { IAccountsResponse, IHistoryResponse } from '@types';
import jwt from 'jsonwebtoken';

import { isProd } from '@/constant/env';

class API {
  private BASE_URL: string;
  constructor() {
    this.BASE_URL = isProd
      ? 'https://facebook-owl.onrender.com/api'
      : 'http://localhost:3000/api';
  }
  async getHistory(token: string): Promise<IHistoryResponse> {
    const response = await fetch(
      `${this.BASE_URL}/sync/history?token=${token}`
    );
    if (!response.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    return response.json();
  }
  async getHistoryByListId(
    token: string,
    listId: string
  ): Promise<IHistoryResponse> {
    const response = await fetch(`${this.BASE_URL}/sync/history/${listId}`, {
      method: 'get',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    return response.json();
  }

  getAccountsList = async (
    token: string,
    ownerId: string
  ): Promise<IAccountsResponse[] | []> => {
    const res = await fetch(
      `${this.BASE_URL}/sync/switch?token=${token}&current=${ownerId}`,
      {}
    );
    if (!res.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    return res.json();
  };

  switchAccount = (oId: string, bId: string): string => {
    const payload = {
      ownerId: oId,
      browserId: bId,
    };
    const token = jwt.sign(payload, process.env.token as string, {
      expiresIn: '5m',
    });
    return token;
  };
}

export default new API();
