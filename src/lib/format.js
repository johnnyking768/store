import { site } from "../config/site.js";
export const formatNaira = (value) =>
  `${site.currency}${new Intl.NumberFormat("en-NG").format(value)}`;
