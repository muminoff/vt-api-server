/* announcement table */
create table "announcements" (
  "id" bigserial primary key,
  "title" character varying(32) not null,
  "body" text,
  "parent_room" bigint not null references rooms(id),
  "archived" bool default false,
  "owner" bigint not null references users(id),
  "attrs" jsonb,
  "created_at" timestamp without time zone default (now() at time zone 'utc')
);

/* topics table index */
create index active_announcements on announcements (id) where archived is not true;
