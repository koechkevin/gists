export enum EnvType {
  Local = 'local',
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Qa = 'qa',
}

interface ServerConfig {
  host: string;
  apiUrl: string;
  chatApiUrl: string;
  fileServerApiUrl: string;
  cookieDomain: string;
}

const serverEnvironments: {
  local: ServerConfig;
  qa: ServerConfig;
  staging: ServerConfig;
  development: ServerConfig;
  production: ServerConfig;
} = {
  [EnvType.Local]: {
    host: 'http://development.aurora.app',
    apiUrl: 'https://api.dev.aurora.app',
    chatApiUrl: 'https://chat-api.dev.aurora.app',
    fileServerApiUrl: 'https://file-api.dev.aurora.app',
    cookieDomain: 'localhost',
  },
  [EnvType.Development]: {
    host: 'http://development.aurora.app',
    apiUrl: 'https://api.dev.aurora.app',
    chatApiUrl: 'https://chat-api.dev.aurora.app',
    fileServerApiUrl: 'https://file-api.dev.aurora.app',
    cookieDomain: '.dev.aurora.app',
  },
  [EnvType.Qa]: {
    host: 'https://qa.aurora.app',
    apiUrl: 'https://api.qa.aurora.app',
    chatApiUrl: 'https://chat-api.qa.aurora.app',
    fileServerApiUrl: 'https://file-api.qa.aurora.app',
    cookieDomain: '.qa.aurora.app',
  },
  [EnvType.Staging]: {
    host: 'https://staging.aurora.app',
    apiUrl: 'https://api.stg.aurora.app',
    chatApiUrl: 'https://chat-api.stg.aurora.app',
    fileServerApiUrl: 'https://file-api.stg.aurora.app',
    cookieDomain: '.aurora.app',
  },
  [EnvType.Production]: {
    host: 'https://jobs.aurora.app',
    apiUrl: 'https://api.aurora.app',
    chatApiUrl: 'https://chat-api.aurora.app',
    fileServerApiUrl: 'https://files-api.aurora.app',
    cookieDomain: '.aurora.app',
  },
};

// Node process env variable
export const Env: EnvType = process.env.NODE_ENV as EnvType;

// Node process.env.REACT_APP_BUILD
export const BuildEnv = process.env.REACT_APP_BUILD;

// Env is development
export const __DEV__: boolean = Env === EnvType.Development || BuildEnv === EnvType.Development;

// Env is staging
export const __STAG__: boolean = BuildEnv === EnvType.Staging;

// Env is production
export const __PROD__: boolean = Env === EnvType.Production;

// Server env variables function
export const ServerEnv = () => {
  if (process.env.REACT_APP_BUILD === EnvType.Production) {
    // For production build
    return serverEnvironments[EnvType.Production];
  }

  if (process.env.REACT_APP_BUILD === EnvType.Qa) {
    // For qa build
    return serverEnvironments[EnvType.Qa];
  }

  if (process.env.REACT_APP_BUILD === EnvType.Staging) {
    // For staging build
    return serverEnvironments[EnvType.Staging];
  }

  if (process.env.REACT_APP_BUILD === EnvType.Development) {
    // For development build
    return serverEnvironments[EnvType.Development];
  }

  // In all other cases return local environment config
  return serverEnvironments[EnvType.Local];
};
