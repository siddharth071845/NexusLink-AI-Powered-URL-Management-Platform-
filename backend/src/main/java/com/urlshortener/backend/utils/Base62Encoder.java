package com.urlshortener.backend.utils;

public class Base62Encoder {

    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int BASE = ALPHABET.length();

    public static String encode(long number) {
        if (number == 0)
            return String.valueOf(ALPHABET.charAt(0));
        StringBuilder sb = new StringBuilder();
        while (number > 0) {
            sb.append(ALPHABET.charAt((int) (number % BASE)));
            number /= BASE;
        }
        return sb.reverse().toString();
    }

    public static long decode(String str) {
        long number = 0;
        for (int i = 0; i < str.length(); i++) {
            number = number * BASE + ALPHABET.indexOf(str.charAt(i));
        }
        return number;
    }
}
