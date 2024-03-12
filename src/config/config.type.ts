export type Config = {
  env: string;
  port: number;
  mongoose: {
    url: string;
    options: {
      useCreateIndex: boolean;
      useNewUrlParser: boolean;
      useUnifiedTopology: boolean;
    };
  };
  jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
    resetPasswordExpirationMinutes: number;
    verifyEmailExpirationMinutes: number;
    cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      signed: boolean;
    };
  };
  email: {
    smtp: {
      host: string;
      port: number;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
  };
  clientUrl: string;
};
