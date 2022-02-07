package com.ersa.tracker.utils;

import java.text.SimpleDateFormat;
import java.util.Locale;

public class DateUtils {
    public static Locale LOCALE_SWE = new Locale("sv","SE");
    public static SimpleDateFormat FORMAT_YYYYww = new SimpleDateFormat("YYYYww", LOCALE_SWE);
    public static SimpleDateFormat FORMAT_yyyyMMddHHmm = new SimpleDateFormat("yyyy-MM-dd HH:mm", LOCALE_SWE);
}
