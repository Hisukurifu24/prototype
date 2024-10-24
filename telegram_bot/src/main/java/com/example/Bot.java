package com.example;

import java.util.List;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.LoginUrl;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public class Bot extends TelegramLongPollingBot {
	private InlineKeyboardMarkup keyboardM1;

	@Override
	public String getBotUsername() {
		return "AmazingSynclabBot";
	}

	@Override
	public String getBotToken() {
		return "7917483032:AAHZv1gfmyr8onZvh-Lfto3_osAELQPnoG8";
	}

	@Override
	public void onUpdateReceived(Update update) {

		var msg = update.getMessage();
		var user = msg.getFrom();

		if (msg.isCommand()) {
			if (msg.getText().equals("/start")) {
				var url = InlineKeyboardButton.builder()
						.text("Start the app")
						.loginUrl(new LoginUrl("https://tminiapp-unipd.web.app/auth"))
						.build();
				keyboardM1 = InlineKeyboardMarkup.builder()
						.keyboardRow(List.of(url))
						.build();

				sendText(user.getId(), "Hello, " + user.getFirstName() + "!");
				SendMessage sm = SendMessage.builder().chatId(user.getId().toString())
						.parseMode("HTML").text("Press the button below to access the app")
						.replyMarkup(keyboardM1).build();
				try {
					execute(sm);
				} catch (TelegramApiException e) {
					throw new RuntimeException(e);
				}
			} else if (msg.getText().equals("/help")) {
				sendText(user.getId(), "I'm a bot that can help you with your daily tasks!");
			} else {
				sendText(user.getId(), "I'm sorry, I don't understand that command.");
			}
			return;
		}
	}

	public void sendText(Long who, String what) {
		SendMessage sm = SendMessage.builder()
				.chatId(who.toString()) // Who are we sending a message to
				.text(what).build(); // Message content
		try {
			execute(sm); // Actually sending the message
		} catch (TelegramApiException e) {
			throw new RuntimeException(e); // Any error will be printed here
		}
	}
}
