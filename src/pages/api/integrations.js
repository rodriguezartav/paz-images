import Integrations from "../../helpers/integrations";
import Users from "../../helpers/users";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  const integrations = Integrations(
    { user: session.user },

    req.headers
  );

  const users = Users({ user: session.user }, req.headers);

  if (req.method == "GET") {
    const result = await integrations.getIntegrations();
    res.status(200).json(result);
  }
}
