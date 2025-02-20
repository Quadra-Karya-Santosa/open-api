import { Injectable } from '@nestjs/common';
import { GetTelegramUpdateI } from '../dto/telegram.dto';
import { Hears, InjectBot, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Telegram } from 'libs/entities/seeds';
import { SeedsTelegramRepository } from './seeds-telegram.repository';

@Update()
@Injectable()
export class TelegramPaymentRepository {
  constructor(
    private readonly seedsTelegramRepo: SeedsTelegramRepository,
    @InjectBot('Payment Bot') private catBot: Telegraf<Context>,
  ) {}

  private readonly botToken = process.env.TELEGRAM_BOT_PAYMENT_TOKEN;
  private readonly apiUrl = `https://api.telegram.org/bot${this.botToken}`;

  sendMessage = async (message: string, ids: number[]) => {
    const promises: Promise<any>[] = [];
    ids.forEach((id) => {
      const send = fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: id,
          text: message,
        }),
      });
      promises.push(send);
    });
    const results = await Promise.allSettled(promises);
    return results.map((result, i) => ({
      chatId: ids[i],
      status: result.status === 'fulfilled' ? 'success' : 'error',
      data: result.status === 'fulfilled' ? result.value : result.reason,
    }));
  };

  getTelegramUpdates = async () => {
    const response = await fetch(`${this.apiUrl}/getUpdates`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: GetTelegramUpdateI = await response.json();
    return data;
  };

  @Hears('/notify me')
  async hearsHi(ctx: Context) {
    const chatId = ctx.message.chat.id;
    const exist = await this.seedsTelegramRepo.getByTelegramId(
      chatId.toString(),
    );
    if (exist) {
      await ctx.reply(`You're registered!`);
    } else {
      const name =
        ctx.message.from.first_name ??
        ctx.message.from.username ??
        chatId.toString();
      const telegramUser = new Telegram({
        chatId: chatId.toString(),
        name: name,
      });
      await this.seedsTelegramRepo.createTelegram(telegramUser);
      await ctx.reply(
        `You're all set! We'll keep you posted on payment activities in the Seeds app.`,
      );
    }
  }

  @Hears('/monthly recap')
  async hearMonthlyRecap(ctx: Context) {
    const exist = await this.seedsTelegramRepo.getByTelegramId(
      ctx.message.chat.id.toString(),
    );
    if (!exist) {
      await ctx.reply(`You're not registered!`);
    } else {
      await ctx.reply(`Update`);
    }
  }
}
