drop extension if exists "pg_net";

create type "public"."Role" as enum ('DEV', 'TESTER', 'ADMIN');

create sequence "public"."Bug_id_seq";

create sequence "public"."Project_id_seq";

create sequence "public"."Screenshot_id_seq";

create sequence "public"."User_id_seq";

create sequence "public"."Waitlist_id_seq";


  create table "public"."Bug" (
    "id" integer not null default nextval('public."Bug_id_seq"'::regclass),
    "title" text not null,
    "description" text not null,
    "severity" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "projectId" integer not null,
    "createdBy" integer not null
      );


alter table "public"."Bug" enable row level security;


  create table "public"."Project" (
    "id" integer not null default nextval('public."Project_id_seq"'::regclass),
    "name" text not null,
    "url" text not null,
    "description" text,
    "createdBy" integer not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP
      );



  create table "public"."Screenshot" (
    "id" integer not null default nextval('public."Screenshot_id_seq"'::regclass),
    "url" text not null,
    "bugId" integer not null
      );



  create table "public"."User" (
    "id" integer not null default nextval('public."User_id_seq"'::regclass),
    "name" text,
    "email" text not null,
    "password" text not null,
    "role" public."Role" not null default 'DEV'::public."Role"
      );



  create table "public"."Waitlist" (
    "id" integer not null default nextval('public."Waitlist_id_seq"'::regclass),
    "email" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "confirmationToken" text,
    "confirmed" boolean not null default false
      );


alter sequence "public"."Bug_id_seq" owned by "public"."Bug"."id";

alter sequence "public"."Project_id_seq" owned by "public"."Project"."id";

alter sequence "public"."Screenshot_id_seq" owned by "public"."Screenshot"."id";

alter sequence "public"."User_id_seq" owned by "public"."User"."id";

alter sequence "public"."Waitlist_id_seq" owned by "public"."Waitlist"."id";

CREATE UNIQUE INDEX "Bug_pkey" ON public."Bug" USING btree (id);

CREATE UNIQUE INDEX "Project_pkey" ON public."Project" USING btree (id);

CREATE UNIQUE INDEX "Screenshot_pkey" ON public."Screenshot" USING btree (id);

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX "Waitlist_email_key" ON public."Waitlist" USING btree (email);

CREATE UNIQUE INDEX "Waitlist_pkey" ON public."Waitlist" USING btree (id);

alter table "public"."Bug" add constraint "Bug_pkey" PRIMARY KEY using index "Bug_pkey";

alter table "public"."Project" add constraint "Project_pkey" PRIMARY KEY using index "Project_pkey";

alter table "public"."Screenshot" add constraint "Screenshot_pkey" PRIMARY KEY using index "Screenshot_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."Waitlist" add constraint "Waitlist_pkey" PRIMARY KEY using index "Waitlist_pkey";

alter table "public"."Bug" add constraint "Bug_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Bug" validate constraint "Bug_createdBy_fkey";

alter table "public"."Bug" add constraint "Bug_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Bug" validate constraint "Bug_projectId_fkey";

alter table "public"."Project" add constraint "Project_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Project" validate constraint "Project_createdBy_fkey";

alter table "public"."Screenshot" add constraint "Screenshot_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES public."Bug"(id) ON DELETE CASCADE not valid;

alter table "public"."Screenshot" validate constraint "Screenshot_bugId_fkey";

grant delete on table "public"."Bug" to "anon";

grant insert on table "public"."Bug" to "anon";

grant references on table "public"."Bug" to "anon";

grant select on table "public"."Bug" to "anon";

grant trigger on table "public"."Bug" to "anon";

grant truncate on table "public"."Bug" to "anon";

grant update on table "public"."Bug" to "anon";

grant delete on table "public"."Bug" to "authenticated";

grant insert on table "public"."Bug" to "authenticated";

grant references on table "public"."Bug" to "authenticated";

grant select on table "public"."Bug" to "authenticated";

grant trigger on table "public"."Bug" to "authenticated";

grant truncate on table "public"."Bug" to "authenticated";

grant update on table "public"."Bug" to "authenticated";

grant delete on table "public"."Bug" to "service_role";

grant insert on table "public"."Bug" to "service_role";

grant references on table "public"."Bug" to "service_role";

grant select on table "public"."Bug" to "service_role";

grant trigger on table "public"."Bug" to "service_role";

grant truncate on table "public"."Bug" to "service_role";

grant update on table "public"."Bug" to "service_role";

grant delete on table "public"."Project" to "anon";

grant insert on table "public"."Project" to "anon";

grant references on table "public"."Project" to "anon";

grant select on table "public"."Project" to "anon";

grant trigger on table "public"."Project" to "anon";

grant truncate on table "public"."Project" to "anon";

grant update on table "public"."Project" to "anon";

grant delete on table "public"."Project" to "authenticated";

grant insert on table "public"."Project" to "authenticated";

grant references on table "public"."Project" to "authenticated";

grant select on table "public"."Project" to "authenticated";

grant trigger on table "public"."Project" to "authenticated";

grant truncate on table "public"."Project" to "authenticated";

grant update on table "public"."Project" to "authenticated";

grant delete on table "public"."Project" to "service_role";

grant insert on table "public"."Project" to "service_role";

grant references on table "public"."Project" to "service_role";

grant select on table "public"."Project" to "service_role";

grant trigger on table "public"."Project" to "service_role";

grant truncate on table "public"."Project" to "service_role";

grant update on table "public"."Project" to "service_role";

grant delete on table "public"."Screenshot" to "anon";

grant insert on table "public"."Screenshot" to "anon";

grant references on table "public"."Screenshot" to "anon";

grant select on table "public"."Screenshot" to "anon";

grant trigger on table "public"."Screenshot" to "anon";

grant truncate on table "public"."Screenshot" to "anon";

grant update on table "public"."Screenshot" to "anon";

grant delete on table "public"."Screenshot" to "authenticated";

grant insert on table "public"."Screenshot" to "authenticated";

grant references on table "public"."Screenshot" to "authenticated";

grant select on table "public"."Screenshot" to "authenticated";

grant trigger on table "public"."Screenshot" to "authenticated";

grant truncate on table "public"."Screenshot" to "authenticated";

grant update on table "public"."Screenshot" to "authenticated";

grant delete on table "public"."Screenshot" to "service_role";

grant insert on table "public"."Screenshot" to "service_role";

grant references on table "public"."Screenshot" to "service_role";

grant select on table "public"."Screenshot" to "service_role";

grant trigger on table "public"."Screenshot" to "service_role";

grant truncate on table "public"."Screenshot" to "service_role";

grant update on table "public"."Screenshot" to "service_role";

grant delete on table "public"."User" to "anon";

grant insert on table "public"."User" to "anon";

grant references on table "public"."User" to "anon";

grant select on table "public"."User" to "anon";

grant trigger on table "public"."User" to "anon";

grant truncate on table "public"."User" to "anon";

grant update on table "public"."User" to "anon";

grant delete on table "public"."User" to "authenticated";

grant insert on table "public"."User" to "authenticated";

grant references on table "public"."User" to "authenticated";

grant select on table "public"."User" to "authenticated";

grant trigger on table "public"."User" to "authenticated";

grant truncate on table "public"."User" to "authenticated";

grant update on table "public"."User" to "authenticated";

grant delete on table "public"."User" to "service_role";

grant insert on table "public"."User" to "service_role";

grant references on table "public"."User" to "service_role";

grant select on table "public"."User" to "service_role";

grant trigger on table "public"."User" to "service_role";

grant truncate on table "public"."User" to "service_role";

grant update on table "public"."User" to "service_role";

grant delete on table "public"."Waitlist" to "anon";

grant insert on table "public"."Waitlist" to "anon";

grant references on table "public"."Waitlist" to "anon";

grant select on table "public"."Waitlist" to "anon";

grant trigger on table "public"."Waitlist" to "anon";

grant truncate on table "public"."Waitlist" to "anon";

grant update on table "public"."Waitlist" to "anon";

grant delete on table "public"."Waitlist" to "authenticated";

grant insert on table "public"."Waitlist" to "authenticated";

grant references on table "public"."Waitlist" to "authenticated";

grant select on table "public"."Waitlist" to "authenticated";

grant trigger on table "public"."Waitlist" to "authenticated";

grant truncate on table "public"."Waitlist" to "authenticated";

grant update on table "public"."Waitlist" to "authenticated";

grant delete on table "public"."Waitlist" to "service_role";

grant insert on table "public"."Waitlist" to "service_role";

grant references on table "public"."Waitlist" to "service_role";

grant select on table "public"."Waitlist" to "service_role";

grant trigger on table "public"."Waitlist" to "service_role";

grant truncate on table "public"."Waitlist" to "service_role";

grant update on table "public"."Waitlist" to "service_role";


