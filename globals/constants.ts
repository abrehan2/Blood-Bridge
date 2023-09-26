class _Constants {
  /**
   * Durations in millisecs
   */
  readonly duration = {
    extraShort: 250,
    short: 500,
    medium: 1000,
    long: 2000,
    extraLong: 6000,
  };

  readonly DATE_TIME_LOCALE = 'en';
  readonly phoneRegExp = /^\d{11}$/;
  readonly CNIC_REGEXP = /^\d{5}-\d{7}-\d{1}$/;

  readonly REGEX_EMAIL =
    /^\s*\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z0-9\-]{2,})+\s*$/;

  readonly DEFAULT_APP_LOCALE = "en-US";
}

export const Constants = new _Constants();