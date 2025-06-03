const config = {
  production: {
    SECRET: process.env.SECRET || "fallbackSecret",
    DATABASE: process.env.MONGODB_URI || "mongodb://localhost:27017/DBB",
  },
  default: {
    SECRET: "mysecretkey",
    DATABASE: "mongodb://localhost:27017/DBB",
  },
};

const get = (env) => config[env] || config.default;

export default { get };