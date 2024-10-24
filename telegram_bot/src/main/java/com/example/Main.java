package com.example;

import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

public class Main {
    public static void main(String[] args) throws TelegramApiException {
        TelegramBotsApi botsApi;
        botsApi = new TelegramBotsApi(DefaultBotSession.class);
        Bot bot = new Bot(); // We moved this line out of the register method, to access it later
        botsApi.registerBot(bot);
        bot.sendText(335625701L, "Hello World!"); // The L just turns the Integer into a Long

    }
}