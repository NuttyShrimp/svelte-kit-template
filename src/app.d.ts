// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
  }
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  // Declare the attributes here that you return inn `lucia.getUserAttributes`
  type DatabaseUserAttributes = Record<string, never>;
  type DatabaseSessionAttributes = Record<string, never>;
}

export { };
