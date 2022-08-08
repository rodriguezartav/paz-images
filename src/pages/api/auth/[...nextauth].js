import EmailProvider from "next-auth/providers/email";
import Adapter from "../../../helpers/authAdapter";

import NextAuth from "next-auth";

export default NextAuth({
  callbacks: {
    async session(props) {
      return {
        ...props.session,
        user: {
          ...props.session.user,
          customer_id: props.user.customer_id,
          image: props.user.image,
          role: props.user.role,
          position: props.user.position,
          customer_name: props.user.customer_name,
          country_code: props.user.country_code,
          phone: props.user.phone,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  // Configure one or more authentication providers
  adapter: Adapter(),
  providers: [
    EmailProvider({
      secret: process.env.AUTH_SECRET,
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
});
