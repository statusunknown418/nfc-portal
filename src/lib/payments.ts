"server only";
import MercadoPago, { Preference } from "mercadopago";

import { env } from "~/env";

export const payments = new MercadoPago({
  accessToken: env.MERCADOPAGO_TOKEN,
});

export const getNFCProducts = ({
  title,
  description,
  id,
  unitPrice,
}: {
  title: string;
  description: string;
  id: string;
  unitPrice: number;
}) =>
  new Preference(payments)
    .create({
      body: {
        items: [
          {
            id,
            title,
            description,
            unit_price: unitPrice,
            quantity: 1,
          },
        ],
      },
    })
    .then((res) => res.sandbox_init_point);
