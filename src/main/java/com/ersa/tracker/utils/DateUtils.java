package com.ersa.tracker.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class DateUtils {
    public static Locale LOCALE_SWE = new Locale("sv","SE");
    public static SimpleDateFormat FORMAT_YYYYww = new SimpleDateFormat("YYYYww", LOCALE_SWE);
    public static SimpleDateFormat FORMAT_yyyyMMddHHmm = new SimpleDateFormat("yyyy-MM-dd HH:mm", LOCALE_SWE);

    public static int getWeekForDate(Date date) {
        String yyyyww = DateUtils.FORMAT_YYYYww.format(date.getTime());
        return Integer.parseInt(yyyyww);
    }

    public static int getCurrentWeek() {
        Calendar cal = Calendar.getInstance();
        // ISO 8601
        cal.setMinimalDaysInFirstWeek(4);
        String yyyyww = DateUtils.FORMAT_YYYYww.format(cal.getTime());
        return Integer.parseInt(yyyyww);
    }
}
