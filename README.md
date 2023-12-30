# Sveltekit template

A very high opiniotated boilerplate to be used in the StudentKick-off tech-stack

The boilerplates includes the following libraries/framework

- [Sveltekit](kit.svelte.dev)
- [Drizzle-ORM](orm.drizzle.team/docs/overview)
- [ShadCN](www.shadcn-svelte.com)
- [Lucia-auth](https://lucia-auth.com/)
- [TRPC-svelte-query](https://github.com/ottomated/trpc-svelte-query), this is a ready to go combination of [Tanstack-query](tanstack.com/query/latest/docs/svelte/overview) and [TRPC](trpc.io)
- [Fontawesome](fontawesome.com)
- [MJML](documentation.mjml.io/)

## What is missing?

Well we previously used Sentry to capture our exceptions. We need to revisit the idea if we still want to use it.
Depending on what we do for our exception monitoring, we could use something like highlight.io which will give us our missing features. The only problem with that is it is still in active development, or feels like that at least.
If we keep using sentry for our exceptions, we could spin up a graylog server which we could use for our logs. Jan has some experience in using it so it shouldn't be that big of a problem to spin up an instance for SKO
