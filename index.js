const { default: axios } = require("axios");
const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const cryptoToken = process.env.CRYPTO_TOKEN;
bot.start((ctx, next) => {
  ctx.telegram.sendMessage(ctx.chat.id, "سلام به ربات ارز دیجیتال خوش آمدید", {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: {
      inline_keyboard: [
        [{ text: "قیمت رمز ارز ها", callback_data: "pricing" }],
        [{ text: "CoinList(cryptoCompare)", url: "https://www.cryptocompare.com/" }],
      ],
    },
  });
  next();
});

bot.action("pricing", (ctx, next) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  bot.telegram.sendMessage(
    ctx.chat.id,
    "لطفا یکی از ارز های دیجیتال زیر را انتخاب کنید",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "BTC", callback_data: "BTC" },
            { text: "ETH", callback_data: "ETH" },
          ],
          [
            { text: "USDT", callback_data: "USDT" },
            { text: "BUSD", callback_data: "BUSD" },
          ],
          [{ text: "منوی اصلی", callback_data: "mainmenu" }],
        ],
      },
    }
  );
  next();
});
bot.action(["BTC", "ETH", "USDT", "BUSD"], async (ctx, next) => {
  const apiURL = `https://min-api.cryptocompare.com/data/price?fsym=${ctx.match}&tsyms=USD&api_key=${cryptoToken}`;
  const data = await axios.get(apiURL).then((res) => res.data);
  ctx.reply(`${Object.keys(data)[0]}: ${Object.values(data)[0]}`);
  ctx.answerCbQuery();
  next();
});
bot.action("mainmenu", (ctx, next) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, "منوی اصلی: ", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "قیمت رمز ارز ها", callback_data: "pricing" }],
        [{ text: "CoinList(cryptoCompare)", url: "https://www.cryptocompare.com/" }],
      ],
    },
  });
  next();
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});
bot.launch().then(console.log("bot run successfully"));
// async(ctx,next)=>{
//   await next()
// }
