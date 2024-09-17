"server only";
import MercadoPago from "mercadopago";

import { env } from "~/env";

export const payments = new MercadoPago({
  accessToken: env.MERCADOPAGO_TOKEN,
});
