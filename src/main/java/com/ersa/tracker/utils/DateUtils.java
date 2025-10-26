package com.ersa.tracker.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class DateUtils {
    public static Locale LOCALE_SWE = Locale.of("sv","SE");
    public static TimeZone TZ_SWE = TimeZone.getTimeZone("Europe/Berlin");
    public static SimpleDateFormat FORMAT_YYYYww = new SimpleDateFormat("YYYYww", LOCALE_SWE);
    public static SimpleDateFormat FORMAT_yyyyMMddHHmm = new SimpleDateFormat("yyyy-MM-dd HH:mm", LOCALE_SWE);
    public static SimpleDateFormat FORMAT_yyyyMMdd = new SimpleDateFormat("yyyy-MM-dd", LOCALE_SWE);

    static {
        FORMAT_YYYYww.setTimeZone(TZ_SWE);
        FORMAT_yyyyMMddHHmm.setTimeZone(TZ_SWE);
    }

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

    public static Date addMinutes(Date date, int minutes) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MINUTE, minutes);
        return c.getTime();
    }
}
