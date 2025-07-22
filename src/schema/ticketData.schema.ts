import {z} from "zod";

const ticketDataSchema = z.object({
  id: z.string().nonempty("L'ID est requis"),
  lastname: z.string().nonempty("Le nom de famille est requis"),
  firstname: z.string().nonempty("Le prénom est requis"),
  email: z.string().email("L'email doit être une adresse valide"),
  ticketType: z.string().nonempty("Le type de billet est requis"),
});

export default ticketDataSchema;