This is a high priority project. I want you to build out an abstract interface library for synthesizers and other things with twiddly knobs and the like.

We'll use React with Vite for fast development and build.
We'll implement PWA capabilities for offline use.

The goal is to provide a service where a user, who is usually a musician, needs to save some settings for a sound they like or to help them remember what configuration they need for a song.

It should have the ability to have a generic "thing" and a "configuration" with a data-dictated UI. The user provides specifics such as names, types of knobs, etc. and the user is able to select how to represent it and what it's connected to and so forth.

Images and sound files will be addable by the user.

Postgres is probably the best database choice with unlogged tables for cache, normal tables for sql, and json for abstract documents (WHICH THESE ARE and so a fundamental thing: { id: [identifier], content: [json], [standard record keeping / indexing properties]}).