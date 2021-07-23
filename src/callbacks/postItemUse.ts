import * as removeFCBanners from "../features/optional/quality/removeFortuneCookieBanners";

export function fortuneCookie(): void {
  removeFCBanners.postItemUse();
}
