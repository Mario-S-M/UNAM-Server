--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4 (Debian 14.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_activity_history DROP CONSTRAINT IF EXISTS "FK_fcb6ec7020e048285b4f11913cb";
ALTER TABLE IF EXISTS ONLY public.user_activity_history DROP CONSTRAINT IF EXISTS "FK_f77a5bd1ef2d155475a539eb375";
ALTER TABLE IF EXISTS ONLY public.user_activity_history DROP CONSTRAINT IF EXISTS "FK_f36b4336ed7a514b5af64ec9363";
ALTER TABLE IF EXISTS ONLY public.contents DROP CONSTRAINT IF EXISTS "FK_ed30ad1fb138f8a39423def926f";
ALTER TABLE IF EXISTS ONLY public.user_progress DROP CONSTRAINT IF EXISTS "FK_e3c495b43c64ba9f0c41c6d543e";
ALTER TABLE IF EXISTS ONLY public.levels DROP CONSTRAINT IF EXISTS "FK_e26233ab486e99ff0b5cfbdecf1";
ALTER TABLE IF EXISTS ONLY public.form_question_options DROP CONSTRAINT IF EXISTS "FK_e1476a302a775a6cb992f57d52f";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "FK_df00e7cf13b1ccac576f6e55583";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "FK_da6f4b7b21f0e7d76533beae661";
ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS "FK_cad5a64685c1be599c10bb7fc7b";
ALTER TABLE IF EXISTS ONLY public.form_questions DROP CONSTRAINT IF EXISTS "FK_c5db27e902da65a144f65ef1c1c";
ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS "FK_b5d8d8621106f2ca4bbe5079591";
ALTER TABLE IF EXISTS ONLY public.user_progress DROP CONSTRAINT IF EXISTS "FK_b5d0e1b57bc6c761fb49e79bf89";
ALTER TABLE IF EXISTS ONLY public.forms DROP CONSTRAINT IF EXISTS "FK_b53e8c7967f93bdae0280392983";
ALTER TABLE IF EXISTS ONLY public.contents DROP CONSTRAINT IF EXISTS "FK_aa89c4c21aaa5b89bb00cc3dcd7";
ALTER TABLE IF EXISTS ONLY public.form_responses DROP CONSTRAINT IF EXISTS "FK_8e9a32f15bd2485ea908787b634";
ALTER TABLE IF EXISTS ONLY public.form_answers DROP CONSTRAINT IF EXISTS "FK_8a93549526f1be39e45a93d0a23";
ALTER TABLE IF EXISTS ONLY public.plate_comments DROP CONSTRAINT IF EXISTS "FK_7f5ade341af9c60dc105cfaf920";
ALTER TABLE IF EXISTS ONLY public.activities DROP CONSTRAINT IF EXISTS "FK_762e49596d3c8e3f8733e0fa7f8";
ALTER TABLE IF EXISTS ONLY public.plate_comments DROP CONSTRAINT IF EXISTS "FK_7292f50b0f6efd4f144c18ddd72";
ALTER TABLE IF EXISTS ONLY public.user_assigned_languages DROP CONSTRAINT IF EXISTS "FK_71b4a202cc8a050609dc8e7ad3b";
ALTER TABLE IF EXISTS ONLY public.user_activity_history DROP CONSTRAINT IF EXISTS "FK_6b916834e21922d3ebb2bfc0db5";
ALTER TABLE IF EXISTS ONLY public.content_teachers DROP CONSTRAINT IF EXISTS "FK_6a7ef0363ffeeb573a7effe837f";
ALTER TABLE IF EXISTS ONLY public.form_answers DROP CONSTRAINT IF EXISTS "FK_62190cf83ebd77895b9bfddfe86";
ALTER TABLE IF EXISTS ONLY public.user_assigned_languages DROP CONSTRAINT IF EXISTS "FK_5520870594c8949070196da3ad7";
ALTER TABLE IF EXISTS ONLY public.content_comments DROP CONSTRAINT IF EXISTS "FK_4a3469cba32f2dd9712821285e5";
ALTER TABLE IF EXISTS ONLY public.contents DROP CONSTRAINT IF EXISTS "FK_43369aa62d40ed47e303ed95432";
ALTER TABLE IF EXISTS ONLY public.content_comments DROP CONSTRAINT IF EXISTS "FK_3b7a59f47df0b7facdf400c5a2a";
ALTER TABLE IF EXISTS ONLY public.form_responses DROP CONSTRAINT IF EXISTS "FK_273348ab1f1af9df94bc0df253c";
ALTER TABLE IF EXISTS ONLY public.content_teachers DROP CONSTRAINT IF EXISTS "FK_0a28258fd41bf15d63873b1792a";
ALTER TABLE IF EXISTS ONLY public.forms DROP CONSTRAINT IF EXISTS "FK_08f0ffcce17394ec4aafcbed2f9";
DROP INDEX IF EXISTS public."IDX_ed671c70a5daeca6bbffdcf31c";
DROP INDEX IF EXISTS public."IDX_71b4a202cc8a050609dc8e7ad3";
DROP INDEX IF EXISTS public."IDX_6a7ef0363ffeeb573a7effe837";
DROP INDEX IF EXISTS public."IDX_5520870594c8949070196da3ad";
DROP INDEX IF EXISTS public."IDX_0a28258fd41bf15d63873b1792";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3";
ALTER TABLE IF EXISTS ONLY public.activities DROP CONSTRAINT IF EXISTS "UQ_762e49596d3c8e3f8733e0fa7f8";
ALTER TABLE IF EXISTS ONLY public.plate_comments DROP CONSTRAINT IF EXISTS "PK_e8c11b38a10d4fda0f52117b1f6";
ALTER TABLE IF EXISTS ONLY public.form_answers DROP CONSTRAINT IF EXISTS "PK_c52f7d73b7cd03332ba47dca123";
ALTER TABLE IF EXISTS ONLY public.content_comments DROP CONSTRAINT IF EXISTS "PK_c37e5a30e089d53670b0b1c36e5";
ALTER TABLE IF EXISTS ONLY public.form_question_options DROP CONSTRAINT IF EXISTS "PK_ba225d5458b4cc14448b984abac";
ALTER TABLE IF EXISTS ONLY public.forms DROP CONSTRAINT IF EXISTS "PK_ba062fd30b06814a60756f233da";
ALTER TABLE IF EXISTS ONLY public.contents DROP CONSTRAINT IF EXISTS "PK_b7c504072e537532d7080c54fac";
ALTER TABLE IF EXISTS ONLY public.user_assigned_languages DROP CONSTRAINT IF EXISTS "PK_a66b25b3aa7f573fac201e4341a";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.lenguages DROP CONSTRAINT IF EXISTS "PK_9aecb24c4e1acd514c7a50c4fc0";
ALTER TABLE IF EXISTS ONLY public.activities DROP CONSTRAINT IF EXISTS "PK_7f4004429f731ffb9c88eb486a8";
ALTER TABLE IF EXISTS ONLY public.user_progress DROP CONSTRAINT IF EXISTS "PK_7b5eb2436efb0051fdf05cbe839";
ALTER TABLE IF EXISTS ONLY public.form_questions DROP CONSTRAINT IF EXISTS "PK_79b081029ae61e3761034f88c85";
ALTER TABLE IF EXISTS ONLY public.user_activity_history DROP CONSTRAINT IF EXISTS "PK_7720a890d0eeca5ea50d2b8b9c5";
ALTER TABLE IF EXISTS ONLY public.content_teachers DROP CONSTRAINT IF EXISTS "PK_601ea8e97808fef284f9bfadf79";
ALTER TABLE IF EXISTS ONLY public.form_responses DROP CONSTRAINT IF EXISTS "PK_36a512e5574d0a366b40b26874e";
ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS "PK_0d3212120f4ecedf90864d7e298";
ALTER TABLE IF EXISTS ONLY public.levels DROP CONSTRAINT IF EXISTS "PK_05f8dd8f715793c64d49e3f1901";
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_progress;
DROP TABLE IF EXISTS public.user_assigned_languages;
DROP TABLE IF EXISTS public.user_activity_history;
DROP TABLE IF EXISTS public.skills;
DROP TABLE IF EXISTS public.plate_comments;
DROP TABLE IF EXISTS public.levels;
DROP TABLE IF EXISTS public.lenguages;
DROP TABLE IF EXISTS public.forms;
DROP TABLE IF EXISTS public.form_responses;
DROP TABLE IF EXISTS public.form_questions;
DROP TABLE IF EXISTS public.form_question_options;
DROP TABLE IF EXISTS public.form_answers;
DROP TABLE IF EXISTS public.contents;
DROP TABLE IF EXISTS public.content_teachers;
DROP TABLE IF EXISTS public.content_comments;
DROP TABLE IF EXISTS public.activities;
DROP TYPE IF EXISTS public.lenguages_nivel_enum;
DROP TYPE IF EXISTS public.lenguages_estado_enum;
DROP TYPE IF EXISTS public.lenguages_badge_destacado_enum;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: lenguages_badge_destacado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lenguages_badge_destacado_enum AS ENUM (
    'Más Popular',
    'Nuevo',
    'Recomendado'
);


ALTER TYPE public.lenguages_badge_destacado_enum OWNER TO postgres;

--
-- Name: lenguages_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lenguages_estado_enum AS ENUM (
    'Activo',
    'Inactivo',
    'En Desarrollo',
    'Pausado'
);


ALTER TYPE public.lenguages_estado_enum OWNER TO postgres;

--
-- Name: lenguages_nivel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lenguages_nivel_enum AS ENUM (
    'Básico',
    'Básico-Intermedio',
    'Intermedio',
    'Intermedio-Avanzado',
    'Avanzado'
);


ALTER TYPE public.lenguages_nivel_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    indication character varying NOT NULL,
    example character varying NOT NULL,
    "contentId" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer DEFAULT '-1'::integer NOT NULL,
    "formId" uuid,
    "estimatedTime" integer,
    "validationStatus" character varying DEFAULT 'sin validar'::character varying NOT NULL
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: content_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    comment text NOT NULL,
    "contentId" uuid NOT NULL,
    "authorId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.content_comments OWNER TO postgres;

--
-- Name: content_teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_teachers (
    "contentId" uuid NOT NULL,
    "teacherId" uuid NOT NULL
);


ALTER TABLE public.content_teachers OWNER TO postgres;

--
-- Name: contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer DEFAULT '-1'::integer NOT NULL,
    "validationStatus" character varying DEFAULT 'sin validar'::character varying NOT NULL,
    "publishedAt" character varying,
    "skillId" uuid,
    "languageId" uuid,
    "levelId" uuid,
    "jsonContent" text,
    "calculatedTotalTime" integer
);


ALTER TABLE public.contents OWNER TO postgres;

--
-- Name: form_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_answers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "textAnswer" text,
    "selectedOptionIds" json,
    "numericAnswer" character varying,
    "booleanAnswer" boolean,
    "questionId" uuid NOT NULL,
    "responseId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "selectedOptionId" character varying,
    "isCorrect" boolean,
    feedback text,
    score double precision
);


ALTER TABLE public.form_answers OWNER TO postgres;

--
-- Name: form_question_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_question_options (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "optionText" character varying NOT NULL,
    "optionValue" character varying,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "imageUrl" character varying,
    color character varying,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "questionId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.form_question_options OWNER TO postgres;

--
-- Name: form_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_questions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "questionText" character varying NOT NULL,
    "questionType" character varying NOT NULL,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    description character varying,
    placeholder character varying,
    "imageUrl" character varying,
    "minValue" integer,
    "maxValue" integer,
    "minLabel" character varying,
    "maxLabel" character varying,
    "maxLength" integer,
    "allowMultiline" boolean DEFAULT false NOT NULL,
    "correctAnswer" text,
    "correctOptionIds" json,
    explanation text,
    "incorrectFeedback" text,
    points numeric(5,2),
    "formId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "audioUrl" character varying
);


ALTER TABLE public.form_questions OWNER TO postgres;

--
-- Name: form_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_responses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "respondentName" character varying,
    "respondentEmail" character varying,
    "isAnonymous" boolean DEFAULT false NOT NULL,
    "ipAddress" character varying,
    "userAgent" character varying,
    status character varying DEFAULT 'completed'::character varying NOT NULL,
    "startedAt" timestamp without time zone,
    "completedAt" timestamp without time zone,
    "formId" uuid NOT NULL,
    "userId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.form_responses OWNER TO postgres;

--
-- Name: forms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forms (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description character varying,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    "allowAnonymous" boolean DEFAULT false NOT NULL,
    "allowMultipleResponses" boolean DEFAULT false NOT NULL,
    "successMessage" character varying,
    "backgroundColor" character varying,
    "textColor" character varying,
    "fontFamily" character varying,
    "publishedAt" timestamp without time zone,
    "closedAt" timestamp without time zone,
    "contentId" uuid NOT NULL,
    "userId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.forms OWNER TO postgres;

--
-- Name: lenguages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lenguages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    eslogan_atractivo text,
    descripcion_corta character varying(100),
    descripcion_completa text,
    nivel public.lenguages_nivel_enum,
    duracion_total_horas integer,
    color_tema character varying(7),
    icono_curso text,
    imagen_hero text,
    badge_destacado public.lenguages_badge_destacado_enum,
    idioma_origen character varying,
    idioma_destino character varying,
    certificado_digital boolean DEFAULT false NOT NULL,
    puntuacion_promedio numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    total_estudiantes_inscritos integer DEFAULT 0 NOT NULL,
    estado public.lenguages_estado_enum DEFAULT 'Activo'::public.lenguages_estado_enum NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    icons text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "calculatedTotalTime" integer
);


ALTER TABLE public.lenguages OWNER TO postgres;

--
-- Name: levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.levels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    percentaje integer DEFAULT 0 NOT NULL,
    qualification integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer DEFAULT '-1'::integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    difficulty character varying DEFAULT 'Básico'::character varying NOT NULL,
    "lenguageId" uuid,
    "calculatedTotalTime" integer
);


ALTER TABLE public.levels OWNER TO postgres;

--
-- Name: plate_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plate_comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    comment text NOT NULL,
    "commentRich" json,
    "contentId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "textSelection" json,
    "selectedText" text,
    "position" json,
    "isResolved" boolean DEFAULT false NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.plate_comments OWNER TO postgres;

--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    color character varying DEFAULT '#3B82F6'::character varying NOT NULL,
    "imageUrl" character varying,
    icon character varying,
    objectives text,
    prerequisites text,
    difficulty character varying DEFAULT 'Básico'::character varying NOT NULL,
    "estimatedHours" integer,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "levelId" uuid,
    "lenguageId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "calculatedTotalTime" integer
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- Name: user_activity_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_activity_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "contentId" uuid NOT NULL,
    "activityId" uuid NOT NULL,
    "formResponseId" uuid,
    status character varying DEFAULT 'completed'::character varying NOT NULL,
    score integer,
    "maxScore" integer,
    "timeSpent" integer,
    "attemptNumber" integer DEFAULT 1 NOT NULL,
    "answeredQuestionIds" json,
    "correctAnswerIds" json,
    "startedAt" timestamp without time zone,
    "completedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_activity_history OWNER TO postgres;

--
-- Name: user_assigned_languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_assigned_languages (
    "userId" uuid NOT NULL,
    "languageId" uuid NOT NULL
);


ALTER TABLE public.user_assigned_languages OWNER TO postgres;

--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "contentId" uuid NOT NULL,
    "progressPercentage" double precision DEFAULT '0'::double precision NOT NULL,
    "completedActivities" integer DEFAULT 0 NOT NULL,
    "totalActivities" integer DEFAULT 0 NOT NULL,
    "completedActivityIds" json,
    "formResponseIds" json,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "lastActivityAt" timestamp without time zone,
    "completedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "fullName" character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    roles text[] DEFAULT '{alumno}'::text[] NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "assignedLanguageId" uuid,
    "lastUpdateBy" uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, name, description, indication, example, "contentId", "createdAt", "updatedAt", "userId", "formId", "estimatedTime", "validationStatus") FROM stdin;
0da17644-72a0-45ca-83c1-faf933394afa	VERB BE	Practice the verb be	Complete the sentences with the correct form of the verb " to be in present.\nCompleta las oraciones con la forma correcta del verbo "to be" en presente.	I ** a teacher.\nRespuesta: I *am* a teacher.	aef14eed-be25-4921-b3ad-a278305060c5	2025-09-19 20:30:33.019173	2025-09-26 01:53:48.832362	-1	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	10	sin validar
a09e5dc6-5bb2-4c6b-9ee0-6005db6a15e5	Regular verbs in past.	Practice the regular verbs in past.	Complete the sentences with the correct form of the verb.	I *watch* a good movie last week.\nANSWER: I watched a good movie last week.	7dff62d7-c7e8-45cc-9af5-1777807e9c07	2025-10-24 06:15:03.201018	2025-10-24 06:15:31.110294	-1	813097d1-0243-40e3-9eab-a0719d2409a7	10	sin validar
aaf3bbbf-d673-40e2-b87a-6cb50b0a3f36	Can, can't. Affirmative	Questions and affirmative answers.	Write the affirmative complete answer to these questions.	Can you speak English?\nYes, I can speak English.	d9094da6-250c-43d4-a4b7-f8dc53bbedec	2025-10-27 23:26:57.869939	2025-10-27 23:28:07.363184	-1	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	15	sin validar
dc241b2c-16d6-4133-a2bc-aeffaa0863d9	Can, can't. Negative	Questions and affirmative answers.	Write complete negative answers to these questions.	Can you speak German?\nNo, I can't speak German.	d9094da6-250c-43d4-a4b7-f8dc53bbedec	2025-10-27 23:40:26.886555	2025-10-27 23:41:11.135272	-1	9398b1e4-4717-4a40-abbc-760c15c8a048	15	sin validar
3d1079ed-9299-4eb7-9f69-8d52fa5703bf	COLORS EXERCISE 1	Identify the words for colors.	Complete the name of the color name in English.	V*ol*t = Violet 	8f0cfafa-77d8-4e51-bfe8-3badbc945639	2025-11-06 18:53:32.906913	2025-11-06 18:53:49.429278	-1	d03c7914-c9db-4e1e-aef5-8d084fe9388b	10	sin validar
08643526-7c86-474c-a7ef-e9d4c53251f1	Simple past regular verbs	We use the Simple Past Tense to express completed actions in the past.	Complete the sentences using the simple past form of the verbs between the stars (*).	Steve *cook* breakfast this morning.\nANSWER: Steve cooked breakfast this morning.	7dff62d7-c7e8-45cc-9af5-1777807e9c07	2025-10-23 17:50:26.555304	2026-01-13 22:29:55.634322	-1	c4065a01-d36e-49fe-84e4-6e8fb0074eed	10	sin validar
ac5a5297-5218-426b-97d0-af5c98ca124e	Simple past. Regular verbs. Exercise 1	Practice the past tense of regular verbs.	Write the following verbs in the simple past tense.	Open\nANSWER: Opened	7dff62d7-c7e8-45cc-9af5-1777807e9c07	2025-10-27 22:51:36.226684	2026-01-16 20:56:07.478082	-1	47ace307-d32f-4201-9304-0221e8df1fcb	10	sin validar
3b810916-fb2b-4ed2-9ee2-859db61231a5	Simple past. Regular verbs. Exercise 3.	Gary had a very important exam this morning. After the exam, he wrote an email to his Mom. \n	Complete Gary's email with the correct verb in simple past.	On Monday morning, I ** the kitchen\nANSWER: OnMonday morning, I cleaned the kitchen	7dff62d7-c7e8-45cc-9af5-1777807e9c07	2026-01-16 23:20:39.692923	2026-01-16 23:21:02.273248	-1	39e9b3c3-7e6b-4151-a857-7d0afffcc39d	25	sin validar
\.


--
-- Data for Name: content_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_comments (id, comment, "contentId", "authorId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: content_teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_teachers ("contentId", "teacherId") FROM stdin;
aef14eed-be25-4921-b3ad-a278305060c5	a45332cc-ddba-43d4-8009-da701b1da38b
aef14eed-be25-4921-b3ad-a278305060c5	41d72bdf-4842-41da-85fb-e0d26d4c48d1
7e740e26-1776-4752-908c-732e022f657f	41d72bdf-4842-41da-85fb-e0d26d4c48d1
d9094da6-250c-43d4-a4b7-f8dc53bbedec	9902423e-b0c5-4952-9f48-f6bed3899538
7dff62d7-c7e8-45cc-9af5-1777807e9c07	9902423e-b0c5-4952-9f48-f6bed3899538
6de6fe05-6be4-474d-bf06-79486adad57d	9902423e-b0c5-4952-9f48-f6bed3899538
a19160c6-e27d-46ab-ab65-76250d1fa6f7	9902423e-b0c5-4952-9f48-f6bed3899538
912c1e69-f954-4c97-91df-5e11520cd2b5	9902423e-b0c5-4952-9f48-f6bed3899538
ee56a11b-0040-4d8d-bbf9-824f0a632099	9902423e-b0c5-4952-9f48-f6bed3899538
7dff62d7-c7e8-45cc-9af5-1777807e9c07	41d72bdf-4842-41da-85fb-e0d26d4c48d1
7dff62d7-c7e8-45cc-9af5-1777807e9c07	a45332cc-ddba-43d4-8009-da701b1da38b
8f0cfafa-77d8-4e51-bfe8-3badbc945639	5069279b-67f2-4f27-9730-dd786ca68443
8f0cfafa-77d8-4e51-bfe8-3badbc945639	41d72bdf-4842-41da-85fb-e0d26d4c48d1
\.


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "userId", "validationStatus", "publishedAt", "skillId", "languageId", "levelId", "jsonContent", "calculatedTotalTime") FROM stdin;
7e740e26-1776-4752-908c-732e022f657f	Listening 1	Practice your comprehension skills.\nPractica tus habilidades de comprensi??n	f	2025-09-26 15:46:31.982623	2025-09-26 16:15:14.593792	-1	APPROVED	\N	f048fa3f-1ac7-4421-aad5-60eb047eb676	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[{"type":"h1","children":[{"text":"T??tulo: Contenido Listening 1"}]},{"type":"p","children":[{"text":""}]}]	0
8f0cfafa-77d8-4e51-bfe8-3badbc945639	COLORS	In this lesson, you can learn basic vocabulary to talk about colors.	f	2025-11-06 18:34:16.554549	2026-01-22 22:16:38.120996	-1	APPROVED	\N	66bbf5fb-8f39-429b-8ac1-e8f2e440d28f	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": " COLORS"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "QrKLfLF1-C",\n    "children": [\n      {\n        "text": ""\n      }\n    ]\n  },\n  {\n    "type": "h1",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Colors.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "14pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)",\n        "bold": true\n      }\n    ],\n    "id": "7LgiPdkUvR"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.38",\n    "children": [\n      {\n        "text": "Topic 1 Colors /?? Aim:??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "s6_FoICWte"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.38",\n    "children": [\n      {\n        "text": "You can learn basic vocabulary for colors in this lesson.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "wvBx6QGGEE"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "pm4151eEmI"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Here is a list of common colors:",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "i_DLaAOyXo"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "9KbpxNPXpr"\n  },\n  {\n    "type": "img",\n    "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAJnAmcDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECBwn/xAAZEQEBAQEBAQAAAAAAAAAAAAAAIREBQTH/2gAMAwEAAhEDEQA/AJ0AcMeqYAM9ABPgALoAGgAUAEABaACAAAAAAvAAQAF4ACAAvAAPAAQAAAAAGwAAAZwADAAaABnvAAaABn6ABQAMAAwAGgAZwAGgAAAZwADAAaABnAAOcABfQATvAAT6AC8ABecwAE5wAF+gAYACYADQAJ6ACegAQAGgATAATnAAaABMABQAAAAAZ0AD0ADgANAAzwAGgAT0AE4ADQAM8AA8ABoAAAAAGdAA8ABoAGPgALoAHe6ACAAvAAaABmgAcABNABeAAaABAAIADQAJoAJzoAEAA0AGgAZgANAAAAAAAAz0AGgAAAAAZ9ABoAAAAAAAAAAAAAGeAA0ADNAAwADoAIAC0ACgAgAAAAAAAL0ACAAgALAAOAAgAAAL4ABAAQAGwAAAZwADAAMABoAGcAAwADAAMAAwADAAMAAwADAAaABnAAMAAwAGgAAAZ6ACAAtAA9ABYACgAAAzAAIAC4ACYABgALAAUAEwADAAIABgAGAAoAAAAAAAAAAAJAAUAAAAAEgAKAAACQAFAAAAAAAAABn0ADAAXAATAAaABmgAgANgAAAAAAAAAzgANAAAAnoAKAAAAADPoANAAAAAAmAAoAJgAGAAoAAAAAAAAAJgAKAAACYABgAKAAADMAAgANAAzAANABAAAAAAXwAEABsAAAAAGYADQAAAAAAAMwAD0ACAAQAFgAJAAIABAAIABAAIABAAIABAAIADQAMwACAAQACAAQAD0ACAAcABAAbABngAIAAAC+AAgANgAAAAAz6ADQAAAAAM+gA0ADPoANAAzAAaABmAAuAAkABoAGYABAAaABmAAQAGgAZgAEAAgANAAzAAXAAPQAUAGdABdAA0AE0AEABdAA0AE0AF0AGgAZ0AGgAZ0AF9ABQAZ0ADQAPQAXQAPAANAA0ADQANAA0ADQATQAaABNAA0ADQANABNABdAA0ADQANABNABoAGeAA0AAADNAA0ADQAKABQANAA0ACgAaABoANAAzoAGgAaABQANAAoAGgAUADQAKADQAM6AC0AE0ACgAaABoANAAzoAFABoAGdAAoAHQANAA4ABgALwAFAAAAABAAUAAAAAEwAFAAAAAAAAAAABOAAoAJQAKACgAAAAAnAAUAEoAKAAACUACgAoAAAAAAAAAAAM9AAoANAAzAAaABIACYACwAEwACAA0AAAAACYACgAkABOcABYACgAkABQAAAAAAATAAUAAAAAAAAAAAAAAAAAEwADAAUAAAGcAA6ABQAOAA0AAAAAAAAAAAAAAAAAAAAAAADPAAaAAAAAAAAAAAAAAABnAAaAAAAAAABmgA0AAAAAAAAAAAAAAAAACUAEoAFABoAEoAKAAAAAAADPwAGgAAAAAZoANAAlABQAAAAAAAAAAASgAoAAAAAAAAAAAAAIACgAAAAAAAAAAAAAAAz0AEABrgAKACQAFAAAAABmAAugAmgAQAF0AFABNABQASAAkABYABoAGgAkAAgAEABdABIABAAIABAAIABAAIABAAIABAAIABAAXQASAAdAAwACgA0AAAAADNABoAGaADQAAAAAJQAUAAAAAAAAAAAE4ABQAKABQASgA0ACUADgAKACUAFABKABQAKACgAAAlABQAAASgAQAEwADgANAAzAAWAAoAJAAUAGYADQAAAJAAUAAAEgAJwAGgAZgANAAAAAAAAAAmAAoAAAAAAAAAMwAGgAAAAAT6ABAAUAAAAAGegAYADQAM6ABQAaAAABnQANAA0ACgAtABKADQAJQAUAEoAJoALQAUAGaADQAM0AFoAFABQASgAUACgAUACgAoAM0AFoAFAAoAFAAoAFABOgAYABwAGgAZ4ABwACAA0ADMAA9ABoAAAAAAAAAAAAAAAAAAAAAGfgANAAAAzoANAAAAzAAaAAABmAA0ADP0AGgAZ+AA0AAAAAAADP0ADAAPAAaAAABKACgAlABQAAAZ0ADQAXQAUAE0ADQANABNAA0AF+gAoAAAAAAAAAAAAAAAAAAAIACgAAAAAAAnQAUAAAEABOAAdAA4ADQAM4ADQAAAAAAAAAM4ACAAvKACAAAAAAAAAAAAvAAaABAAUAAAAAAAAAAAAAAAAAEAAABQAAAAAAAAATQATgAIAC8AA+AA0AAADPAAMABoAAAAAGAAWAAQADgAEABAAAAAAbAAAAAAABMABQAAAAAAAAAZ4ADQAAAAAAAAAAAAAAAAAJQATvQAOUACgA0ACUAFABKACgAAAwAC8ABAAAAAAAAAAAAAAXgANAAlAAoAFAAoAFAAoAFAAoAFAAoAFAAoAHAAKABQAKABQAKACcAA73QANABYACQAFgAJAAPAAaABn0AEAAAAAAAAAAABYABAAIACAAsAAgAHoAEAAgAEAAgAEAAgAEAAgAEABcABIABAAIABAAIACAAvAAWgAc6ABQAUAEoAFAAoAFAAoAKADAALwAEAAAAAAAAAAABeAAvAAUAEoAKAAAAAAACUAFAAABKACgAlAAoAKAAAAAAAAADPAAOgAcAAgANAAAAz4ABAAaABmAAQADgAEAAgAEAAgAEAAgAEAA4ADQAMwAFgAJAAaAAABmAA0ADMABYACQACAAQAFgAJAAaABIACgAzAAOAAUADlABoAEoAKAAACUAFAAABngAIAAAC6ACAAAAAAAAAAvAAaAAABKABQAOAAoAAAAAAAM8ABoAAAE8ABQAAAAAAAAAZzQAOAAdAA4ADQAAAAAAAAAAAAAMwAGgAZgAEAAgAIACwACAAQAFgAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPAAOgAcABoAAAAAGfAAPAAaABn0AGgAZ4ABwAEAAABsAGAAAAAAbAAAAABMABQAAAAAAAAAAAAAZwAGgAZoANAAAAAAAAAAAAzwADAAOAA0AAACAAoAAAAAAAAAAAM8ABoAGAAbABgAAAAAF4ADQAAAAAAAAAAAJgAKAAACYACgAAAAAAAAAAAmAAoAAAJAAToAHAAaABmAAeAAeAAQAGgAZgAIAC8AAgAEAAgAIACwAEAAABeAA0ADMAAgAEAAgANAAzAAIABAAWAAkAAgAEABYACQACAAsABIABAAOAAtAA5wAEoALQAKABQASgA0ACUAGQAAAAAAAAAAAAAWgAgANUAFABKACgAlAAoAKAAAAAAACcAAoAKACUACgAUAFABKACgAzgAHAAOgAcABdABQASAAkABdABIADQAM6ACAAAAAAugAQAEAAAAABeAA0ADMABoAE0AFABOd0AEgAEABYABAAIACgAAAkAA0AFABIACgAzAAOAAdAA5AAKADQAJQAKABQAOgAUAE0ADgAGgAaABoAGgAaABoAGgAc6ADQAJQAKACUAFoAJQAWgAlABaABQASgAtABKAC0ACgAlABaABQASgAcAA9AA4ADQAAAJAAUAAAAAAAGAAAAAAAAAAAAAAAAAAXgALAAUAAAEwAFABMABMABoAEwAE4ADQAAAAAAAAAAAJgAHAAUAGeAAdABoAAAAAAAGfAAaAAAAABKACcAAoAFAAoAFABAAWgAgALwAGgAAAAAAAAAAAAAAAAATgAKAAAAAAAAAAAAAAAAADPAAOgAcABoAAAAAAAGfAAaAAABmgAgALwACgAUACgAgALQAQAGwAAAAAAAAAAAAAAAAAAASAAoAAAAAAAAAJgAKAAACYACcAAgALAANABQASAAkABoAAAAAAAGeAAgAAAAAAAAAAAAALwAGgASAAoAJoAGgAaABAASAA0ADMABYACgAAAAAmgAmgAsABIACwAE4AB0AFABQATgAHAAUAAAGfQAaABnwADgANAAAAmAAnoALgAGAAYACgAAAngAKAAAAAAAAAAAAACAAoAAAAAAAAAAAAAAAD/9k=",\n    "children": [\n      {\n        "text": "",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "EG68QBt4om",\n    "width": 92,\n    "align": "left",\n    "caption": [\n      {\n        "text": "cuadro color rojo"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "children": [\n          {\n            "text": "Red = rojo ?? ",\n            "fontFamily": "Arial, sans-serif",\n            "fontSize": "12pt",\n            "backgroundColor": "transparent",\n            "color": "rgb(0, 0, 0)"\n          }\n        ],\n        "type": "p",\n        "id": "Xsu2BrgBRX"\n      }\n    ],\n    "id": "e36FQTMpJZ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yellow= amarillo",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "JRN8U-Bv6t"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Blue (azul)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "ywYcR0oxSi"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Green (verde)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "lENnKCvssr"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Pink (rosa)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "gmjf2sIEHC"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Purple (p??rpura / morado)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "YBaZUJ4vlv"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Orange (naranja)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "u7jbRNMdnS"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Brown (marr??n / caf??)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "7mq2oYYf2K"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Black (negro)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "j7JcItgCOX"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "White (blanco)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "DF3XduhRUN"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Gray (gris)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4OEgiYFmnQ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Light Blue (azul claro)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "L_ZsprPXa2"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Dark Blue (azul oscuro)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "S4eP23mxL0"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Light Green (verde claro)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "felWqL4mCO"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Dark Green (verde oscuro)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "jR1sSUAyiO"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Gold (dorado)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4rKVsHCrWa"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Silver (plateado)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "aB57Boftsw"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Navy Blue (azul marino)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "mgmZ9kukK0"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Baby Blue (Azul Claro)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "6FG_MGwCHr"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Turquoise (Turquesa)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "flELa7FlQf"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Fuchsia (Fucsia)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "v40r6BN_k3"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Magenta (Magenta)",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "OEz6kSeaxR"\n  },\n  {\n    "type": "h1",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Exercises.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)",\n        "bold": true\n      }\n    ],\n    "id": "B8L1qh0oLj"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Answer the following exercises.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "11pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "LU09T3nN9t"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "S-1N_W9tR9"\n  },\n  {\n    "indent": 1,\n    "listStyleType": "upper-alpha",\n    "type": "p",\n    "children": [\n      {\n        "text": "Complete the name of the colour name in English.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "odpDtwcmMs"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "1. R*d",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "R3xekpOAUe"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "2. Y*ll*w",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "EiuRunom1K"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "3. Bl*e",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "YBAAC1FFnT"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "4. Gr*en",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4Uu2HIz51B"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "5. P*nk",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "9EnhCXxYzG"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "6. Pu*pl*",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "mckN0ujRo7"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "7. Or*n*e",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "30JdRt4tuO"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "8. B*a*k",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "VbFWdkuna4"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "9. W*i*e",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "WOnKNs9gA0"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "10. Gr*y",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "QaQ-MP9Las"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "b) Write the color in Spanish.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "j96QXEvKyv"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "XnsOFHCzQB"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "1. Light Blue. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "dg6kZEXf6M"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "2. Dark Green. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "ZFAN8wU1tT"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "3. Fuchsia. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "-gfkhaASRy"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "4. Gold. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "kh8oHnk8pp"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "5. Silver. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "JhGCCwgEY2"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "6. Navy Blue. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "-rmn9nrZDK"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "7. Pink. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "9Rh4x35QRc"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "8. Orange. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "3uFViMxwRY"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "9. Brown. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "Qwh03gJxSl"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "10. Turquoise. **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "8hiZjCoLZ9"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "c) Read the text and complete the sentences.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "zeskr6I3tQ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Reading: My Colorful Day",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "9giQCY7zqR"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Today is a sunny day. I open my window and see the blue sky. In the garden, the grass is green and the flowers are yellow and red. My cat is sleeping on a white chair. I see a big black dog walking in the street. On the table, there is a bowl of orange oranges and a cup with pink flowers. In my room, the walls are purple and my bed is brown.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4cWm41PSIV"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Questions:",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "6GXfoUXLZo"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "1. The sky is **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "UbL2BFuhiP"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "2. The grass is **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "S1AcqDXWcE"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "3. The flowers are yellow and **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "pombRcDaiE"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "4. The chair is **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "MMZyGiAzRR"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "5. The dog is **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "n_O427ipB-"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "6. The oranges are **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "DMM7GkWOK9"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "7. The flowers in the cup are **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4QZiUlGIi4"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "8. The walls are **.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "hXbA0WP9we"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "9. The bed is **",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "NlL-GpWbcD"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "10. The cat is on a ** chair.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "QdrdUWFPXl"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "0_vmBu7U0h"\n  },\n  {\n    "type": "p",\n    "children": [\n      {\n        "text": ""\n      }\n    ]\n  }\n]	10
6de6fe05-6be4-474d-bf06-79486adad57d	BE GOING TO	In this lesson, you will learn to express plans in the future and predictions based on present evidence.	f	2025-10-15 19:20:41.254606	2026-01-22 22:16:40.798985	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": "Contenido BE GOING TO"\n      }\n    ]\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Future plans.",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "fB_5j3voF5"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We use be going to when we want to express plans in the future.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "Br9rij6ZZH"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I am going to play volleyball next weekend.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "hSI_d5f2xZ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "You are going to eat out tomorrow.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "St6Ur1rDpX"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "He is going to go dancing this weekend.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "sx79tXYz7C"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "It is going to eat meat tomorrow.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "05Y_Eje2p7"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We are going to meet on Monday.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "uSKbhJ7Tbz"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "You are going to have a class next Saturday.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "qkBZnUewoY"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "They are going to swim in the ocean next year.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "yM1XEcQNfc"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Predictions based on present evidence",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "H7PAneYvTQ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "My soccer team is going to win. They have been playing very well.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "kJ5nnSlxcK"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Today is going to rain. The sky is cloudy.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "cXeD6Zyli6"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "That girl is jumping on the bed, I think she is going to fall.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "Ss_uOicYak"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Alfred is going to crash! He is driving really fast.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "zLvk3XI6tV"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Questions and answers.",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "Tn9294iGU_"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Are you going to eat out tomorrow?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "WQKCRlu_hd"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yes, I am.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "XJDSsNpSS4"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "No, I am not.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "3ExCpbED5K"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Is he going to go shopping this weekend.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "-9Lkl6TN_e"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yes, He is.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "s_ObsJ5lKy"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "No, He isn???t.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "qoWHTtL4of"\n  }\n]	0
a19160c6-e27d-46ab-ab65-76250d1fa6f7	INDEFINITE ARTICLES. A, AN.	In this lesson, you will learn how to use the articles "a" and "an" to describe a person, animal, or thing.	f	2025-10-15 19:46:25.247303	2026-01-22 22:16:40.179064	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": "INDEFINITE ARTICLES. A, AN."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "There are two articles in English. One of them is the Indefinite article. It is used before singular, countable nouns which are not specific or known.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "EryH6hP4RA"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "A table",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "FJilDNB5T1"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "A notebook??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "vKa7CcKl5I"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "A student",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "qpD3_Zm0Hc"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "\\"a\\" is used before words that begin with a consonant sound, and ???an??? is used before words that begin with a vowel sound.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "tMc4yqNAMm"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "A boy",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "_hj728e9IR"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "An eraser",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "7XtEMBsEKq"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "A pencil",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "MHJz9J1WD2"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "An umbrella",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "1JVqYXbEpN"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "They are not used with plural or abstract nouns.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "0YM0ahwkAE"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Windows, cars, children, water, traffic, rain.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "tPa5b_erDr"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Use ???a???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "ggXrgjJ01A"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Before a consonant",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "rrZmWfx1s8"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Before an ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???h???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " with sound like ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???j???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "VAYNVwCg-8"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Before a ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???u???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " with sound like ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???iu???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "y7TufCvNZW"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Examples",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "Fy3q1vebOz"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "a",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "b",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": "ook",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "6gEHowbvZT"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "a",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "h",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": "otel",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "WmdAEryycf"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "a",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "u",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": "niversity",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "nc4L5Wr_1V"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Use ???an???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "b7tsGplHbP"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Before a vowel",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4UihmfcowI"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Before a silence ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???h???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "OJTcG2rojC"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Before a ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???u???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " with sound like ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "??? ???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "???O???",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "58FOSo9JSp"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Examples",\n        "fontFamily": "Play, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "2zSr7fjBPS"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "an",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "a",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": "pple",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "-mjRVkQe1C"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "an",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "h",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": "our",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "YoWmFTea3V"\n  },\n  {\n    "children": [\n      {\n        "text": "an",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": " ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      },\n      {\n        "text": "u",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "text": "mbrella",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "type": "p",\n    "id": "pIa_JYdV2u"\n  }\n]	0
ee56a11b-0040-4d8d-bbf9-824f0a632099	PRESENT PERFECT: EVER AND NEVER.	In this lesson, you will learn how to use the present perfect to talk about life experiences.	f	2025-10-15 19:52:33.298878	2026-01-22 22:16:38.785875	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": "PRESENT PERFECT: EVER AND NEVER."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We use present perfect to express ideas in the past at no specific time. Present perfect is formed by the auxiliary have or has and the main verb in past participle. We use have with I, you, we and they. We use has with he, she and it.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "RPs_U2quaJ"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Affirmative",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "y8aRZRdbi1"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I have been to the beach many times.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "HgIPYqkl2O"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Negative",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "EosjcTh2GL"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I haven???t eaten Russian food.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "zvk0FG4wW2"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Interrogative",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "Xdud4FbVFl"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Have you visited a museum in Mexico City?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "MX1iba04Wm"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "When we ask somebody for a non-common action we use ever and we can use never to answer in negative form.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "ivdfLhQjmI"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Have you ever climbed a mountain?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "oPMixOl4VK"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "No, I have never climbed a mountain.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "89RDT_d7yF"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yes, I have. I climbed the Everest last year.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "5Bq6AflLw5"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "afqb2x_LSr"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "Wk3liGGB0S"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "QU2-JkIDnv"\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "IxTdwMmJ6z"\n  }\n]	0
912c1e69-f954-4c97-91df-5e11520cd2b5	DEMONSTRATIVES: THESE, THOSE.	In this lesson, you will learn how to use the demonstratives "these" and "those" to talk about plural things or people that are near you.	f	2025-10-15 19:49:07.796873	2026-01-22 22:16:39.485831	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": "DEMONSTRATIVES: THESE, THOSE."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "Demonstratives ???these??? - ???those??? are used??to point out people or things in plural, indicating their??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "VBvQlhT899"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "proximity to the speaker.??\\"These\\" refers to things that are near, while \\"those??? refers to things??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "gBoJ3o4v22"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.2",\n    "children": [\n      {\n        "text": "that are farther away, either physically or in time.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "GaDD74CbtJ"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Affirmative examples:",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "1UUBvFVeq7"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These are apples.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "SBtsb-pE8Y"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These are shoes.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "tI4D0xATch"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These are my glasses.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "y9tP39if0a"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Those are cars.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "iGs0N21xYo"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These are trees.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "esa_KayBoA"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These are people.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "jZuGKBIatT"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Negative examples:",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "UCtQCGU225"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These aren???t apples.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "4K8N4sSk-V"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These aren???t shoes.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "DmtdScSssV"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These aren???t my glasses.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "FTUslJjYa3"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Those aren???t cars.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "nQZOql-w2B"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These aren???t trees.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "sYB2ntUtiK"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "These aren???t people.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "g8ZynDp7CS"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Interrogative examples",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(15, 71, 97)"\n      }\n    ],\n    "id": "ejpXG-xJvT"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Are these apples?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "HVg6LdIHNo"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Are these shoes?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "EHm4rlMZuA"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Are these my glasses?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "fhdVbURUI2"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Are those cars?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "hRWeIhbjHN"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Are those trees?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "_EeRBsFBP_"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.295",\n    "children": [\n      {\n        "text": "Are those people?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "UCqO0IXdtt"\n  }\n]	0
d9094da6-250c-43d4-a4b7-f8dc53bbedec	CAN, CAN'T, CANNOT.	In this lesson, you will learn the use of can and can't to express ability, permission, and possibility.	f	2025-10-15 19:05:17.368499	2026-01-22 22:16:42.734092	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": "CAN, CAN'T, CANNOT."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Can is the affirmative form.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "aKQi5oBolj"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Cannot is the negative form.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "drh4eG0KER"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Can???t is the contraction for the negative form.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "PKID_mZPWR"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We use this structure to express ability, permission and possibility.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "XvDJJtS4It"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Ability",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "-i4YgzSYsd"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Can you speak English?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "e4FDtT1Rrp"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yes, I can.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "D4I7Tl2m7b"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "No, I can???t.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "B1ZU3sJ08r"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Affirmative sentences",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "hs7jKppeDY"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I can play the piano.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "QcWctMjGJd"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I can sing opera.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "TgIxdxY24G"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Negative??",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "QMl6nlPdXA"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I can???t drive a car.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "pvkuYOz20n"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I can???t cook.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "DRhoDHcQ9f"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Permission",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "8fjqye4be2"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We normally use only I and we in this form.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "cR9G0JjDS-"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Can I go out?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "wAW2Dm-yhg"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Can we make a party here?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "t2-2foeQIs"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yes, you can.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "ozXJSW6N9r"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "No, you can???t.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "M2KmbvDe4l"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Possibility",\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(47, 84, 150)"\n      }\n    ],\n    "id": "abHEDfKMg7"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "I can go on vacation when I have money.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "SiDCJtnlM1"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "You can pass the exam if you study.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "OYX_jA0m78"\n  }\n]	30
7dff62d7-c7e8-45cc-9af5-1777807e9c07	SIMPLE PAST. REGULAR VERBS	In this lesson, you can learn the use of regular verbs to talk about the past.	f	2025-10-15 19:09:15.303001	2026-01-22 22:16:42.177684	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": " SIMPLE PAST. REGULAR VERBS"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "rtQ-xVnvxQ",\n    "children": [\n      {\n        "text": ""\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "In English, there are two kinds of verbs: regular and irregular. In English, all regular verbs in the past end in -ed.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "6WxW_Y0u5g"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "uZqQZnpnjm",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Examples:",\n        "bold": true\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "AzyWxhCcMk",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "work -worked"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "vMsd3Qx7G_",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "love - loved"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "7cJ5j3snUl",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "start - started"\n      }\n    ]\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "id": "5vjevGYrU9",\n    "children": [\n      {\n        "text": "Affirmative sentence",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      },\n      {\n        "text": "s",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We use the verb in the past in affirmative sentences.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "Mok0eW9xn0"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "ZdUEa-JHLi",\n    "children": [\n      {\n        "fontFamily": "Calibri, sans-serif",\n        "fontSize": "13pt",\n        "backgroundColor": "transparent",\n        "bold": true,\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "text": "Subject + verb IN PAST + complement",\n        "color": "#000000"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Examples: ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "InMkihPCT0"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "uGlXDrIZq2",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "I answered the phone."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "oR4h6--xWh",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "They started the project yesterday."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "iYpBo451rz",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": ""\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "eT2ZgsrFve",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": " "\n      },\n      {\n        "text": "Negative sentence",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      },\n      {\n        "text": "s.",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "For negative sentences, we use the auxiliary did and the verb in simple form.??"\n      }\n    ],\n    "id": "mjI1t97zRm"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "A8-7W2EzTM",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Subject + auxiliary did in NEGATIVE + verb in SIMPLE FORM + complement",\n        "bold": true\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Examples:",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "ylcjqDPsjZ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "sbJ3dKzhsK",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "I didn???t answer the phone."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "gUrK8SelNG",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "She didn't clean the house."\n      }\n    ]\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Interrogative sentence",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      },\n      {\n        "text": "s (questions).",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      }\n    ],\n    "id": "iY4di2oBrE"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Fo"\n      },\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "r questions and short answers, we use the auxiliary did and the verb in simple form."\n      }\n    ],\n    "id": "y7hyjrKZqQ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "9KUzRc_SeA",\n    "children": [\n      {\n        "text": "Question word (optional) + auxiliary did + subject + verb in SIMPLE FORM + complement ?",\n        "bold": true\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "MJG5G4vbZ4",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Examples:??"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Did you open the door?",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "wHtKr3G5lN"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yes, I did.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "IvHl3Y0Kbb"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "No, I didn???t.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "epEAF7kbaX"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "qAePZJzMxB",\n    "children": [\n      {\n        "text": "A: Where did you live"\n      },\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "? "\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "0flcEiy5BE",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "B: I lived in France."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "LlNNDoWN7x",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": ""\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "We use the simple past to talk about completed actions in the past.??",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "G7PBzji-Fq"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Time expressions",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      },\n      {\n        "text": ".",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      }\n    ],\n    "id": "PAX8XDv3yi"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Yesterday",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      }\n    ],\n    "id": "XUbVOQADMJ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Ago",\n        "bold": true\n      },\n      {\n        "text": ": five days ago, a"\n      },\n      {\n        "text": " week ago, a month ago, two years ago, etc.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "fN-7PkdXYE"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Last: ",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "bold": true\n      },\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "last month, last week, last Monday, etc."\n      }\n    ],\n    "id": "1fW7VlBatQ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "F7LkLLkg7F"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "tfzXgBtsC9",\n    "children": [\n      {\n        "text": "Common regular verbs",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      },\n      {\n        "text": ".",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "REPtKU4FD3",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Some common regular verbs are:"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Arrive = llegar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "-EK0-50QIe"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "-95q1iJDgW",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Brush = cepillar."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Clean = limpiar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "8aShhZQC3a"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "JTd2hZjxFt",\n    "children": [\n      {\n        "text": "Cook = cocinar",\n        "color": "#000000",\n        "suggestion_ivul9m7SNBM5Ms6jCgZkg": {\n          "id": "ivul9m7SNBM5Ms6jCgZkg",\n          "createdAt": 1768346747278,\n          "newProperties": {\n            "color": "#000000"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "fontSize": "15px",\n        "suggestion_Z32wRP5nODxmqCVEVrmj4": {\n          "id": "Z32wRP5nODxmqCVEVrmj4",\n          "createdAt": 1768346754792,\n          "newProperties": {\n            "fontSize": "15px"\n          },\n          "type": "update",\n          "userId": "alice"\n        }\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Finish = terminar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "q0dyHbD-ko"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "k9WvmRfC6j",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Learn = aprender."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Like = gustar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "z82Gi2HxD8"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Listen to = escuchar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "l1mhHLJIYZ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Live = vivir.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "9i2LV0EhE-"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "wmlQxzd7hW",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Look = ver."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "VAhZAYOQhj",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Need = necesitar."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Play = jugar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "gUUMvFgkVy"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "B9Ip5_gLak",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Stay = quedarse."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Stop = parar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "91TQnT9zig"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Study = estudiar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "dW8RWG-BQB"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Visit = visitar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "56P1k0lN7I"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "id": "jC-PxUp-4k",\n    "children": [\n      {\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)",\n        "text": "Walk = caminar"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Want = querer.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "wMShPFR3gv"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Wash = lavar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "CmBlDg9xVw"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Watch = observar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "AmN9mXWGYZ"\n  },\n  {\n    "type": "p",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Work = trabajar.",\n        "fontFamily": "Arial, sans-serif",\n        "fontSize": "12pt",\n        "backgroundColor": "transparent",\n        "color": "rgb(0, 0, 0)"\n      }\n    ],\n    "id": "xLPWqMPzhz"\n  },\n  {\n    "type": "h2",\n    "lineHeight": "1.8",\n    "children": [\n      {\n        "text": "Spelling",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "suggestion": true,\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      },\n      {\n        "text": " rules.",\n        "fontFamily": "Calibri, sans-serif",\n        "backgroundColor": "transparent",\n        "suggestion_QX-JFc__pMUpkmOHPS34e": {\n          "id": "QX-JFc__pMUpkmOHPS34e",\n          "createdAt": 1761097807977,\n          "newProperties": {\n            "color": "rgb(47, 84, 150)"\n          },\n          "type": "update",\n          "userId": "alice"\n        },\n        "color": "#070255",\n        "bold": true,\n        "fontSize": "24px"\n      }\n    ],\n    "id": "Kc61QECCYL"\n  },\n  {\n    "type": "p",\n    "id": "xhfXdag0eg",\n    "children": [\n      {\n        "text": "General rule: add -ed at the end.",\n        "color": "#000000"\n      }\n    ],\n    "indent": 1,\n    "listStyleType": "disc"\n  },\n  {\n    "type": "p",\n    "id": "FpeXUPkqh9",\n    "children": [\n      {\n        "color": "#000000",\n        "text": "Examples:"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "92twxD4Op0",\n    "children": [\n      {\n        "color": "#000000",\n        "text": "help - helped."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "v6TKh9Xdyl",\n    "children": [\n      {\n        "color": "#000000",\n        "text": "talk - talked."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "mczwQ6p1kh",\n    "children": [\n      {\n        "color": "#000000",\n        "text": "need - needed"\n      }\n    ]\n  },\n  {\n    "children": [\n      {\n        "text": "Verbs with final -e: add -d at the end."\n      }\n    ],\n    "type": "p",\n    "id": "jF5lll_dLy",\n    "indent": 1,\n    "listStyleType": "disc"\n  },\n  {\n    "type": "p",\n    "id": "N-etMj2m5P",\n    "children": [\n      {\n        "text": "Examples:"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "akRNZfpdHE",\n    "children": [\n      {\n        "text": "love - loved"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "jniRx9TvWW",\n    "children": [\n      {\n        "text": "move - moved"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "vtMbOg_fYE",\n    "children": [\n      {\n        "text": "use - used"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "A2l8vaIhh_",\n    "children": [\n      {\n        "text": "Verbs with final consonant + -y: change -y to -i and add -ed at the end."\n      }\n    ],\n    "indent": 1,\n    "listStyleType": "disc"\n  },\n  {\n    "type": "p",\n    "id": "mwX2c5JDZe",\n    "children": [\n      {\n        "text": "Examples:"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "FT3bMyCwaE",\n    "children": [\n      {\n        "text": "study - studied."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "pfQv11ywn1",\n    "children": [\n      {\n        "text": "try - tried."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "4E6Cd8Tl4V",\n    "children": [\n      {\n        "text": "Verbs with final vowel + -y: add -ed at the end."\n      }\n    ],\n    "indent": 1,\n    "listStyleType": "disc"\n  },\n  {\n    "type": "p",\n    "id": "aZ79UIproo",\n    "children": [\n      {\n        "text": "Examples:"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "kigVSyvi7T",\n    "children": [\n      {\n        "text": "play - played."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "DuPt4x6AVi",\n    "children": [\n      {\n        "text": "enjoy -enjoyed."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "rLNva40LUd",\n    "children": [\n      {\n        "text": "Some verbs with final consonant + vowel + consonant: double the last consonant + -ed at the end."\n      }\n    ],\n    "indent": 1,\n    "listStyleType": "disc"\n  },\n  {\n    "type": "p",\n    "id": "RUWAr6swRy",\n    "children": [\n      {\n        "text": "Examples:"\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "vcjJv-mk9O",\n    "children": [\n      {\n        "text": "plan - planned."\n      }\n    ]\n  },\n  {\n    "type": "p",\n    "id": "SeZuzL6x6I",\n    "children": [\n      {\n        "text": "stop - stopped."\n      }\n    ]\n  }\n]	55
aef14eed-be25-4921-b3ad-a278305060c5	Verb be	In this lesson, you will learn the basic rules to use the verb "to be" correctly. This is a very common verb in the English language.\nEn esta lecci??n aprender??s las reglas b??sicas del uso del verbo be (uno de los m??s usados en el idioma ingl??s). \n\n	f	2025-09-19 19:47:24.977953	2026-01-22 22:16:43.41923	-1	APPROVED	\N	e8de288c-49f7-45bb-ad06-3b20ae54275b	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	912b2be1-3b43-4f6b-b250-e2aa336328e8	[\n  {\n    "type": "h1",\n    "children": [\n      {\n        "text": "VERB "\n      },\n      {\n        "text": "BE",\n        "backgroundColor": "#FE0000"\n      }\n    ],\n    "id": "wacKKjsKvN"\n  },\n  {\n    "children": [\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "type": "p",\n                "children": [\n                  {\n                    "text": "SUBJECT"\n                  }\n                ],\n                "id": "QbOyddWEXW"\n              }\n            ],\n            "type": "td",\n            "id": "SUXw3LLTMz"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "FULL FORM"\n                  }\n                ],\n                "type": "p",\n                "id": "0jhtRlm0oo"\n              }\n            ],\n            "type": "td",\n            "id": "eDi2C15RXB"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "CONTRACTION"\n                  }\n                ],\n                "type": "p",\n                "id": "43HAXYFLqY"\n              }\n            ],\n            "type": "td",\n            "id": "h8QD3suV-8"\n          }\n        ],\n        "type": "tr",\n        "id": "aPzFwhExpd"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "I"\n                  }\n                ],\n                "type": "p",\n                "id": "QmU8i24xAI"\n              }\n            ],\n            "type": "td",\n            "id": "xKBwZZyBW9"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "am"\n                  }\n                ],\n                "type": "p",\n                "id": "V4ktYpINnO"\n              }\n            ],\n            "type": "td",\n            "id": "nuvF_82LRo"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "I'm"\n                  }\n                ],\n                "type": "p",\n                "id": "vtxfU-m2LQ"\n              }\n            ],\n            "type": "td",\n            "id": "MqwACVrZ0G"\n          }\n        ],\n        "type": "tr",\n        "id": "CtHaM8qptb"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "You"\n                  }\n                ],\n                "type": "p",\n                "id": "DKX9Cya1yB"\n              }\n            ],\n            "type": "td",\n            "id": "urMZORGWf-"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "are"\n                  }\n                ],\n                "type": "p",\n                "id": "gKYBN5q2Ii"\n              }\n            ],\n            "type": "td",\n            "id": "iDvwDWDr3t"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "You're"\n                  }\n                ],\n                "type": "p",\n                "id": "fUsEW4bfC7"\n              }\n            ],\n            "type": "td",\n            "id": "ogh8qYBJxh"\n          }\n        ],\n        "type": "tr",\n        "id": "B6YkQiTgPe"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "She"\n                  }\n                ],\n                "type": "p",\n                "id": "pDKteiQOat"\n              }\n            ],\n            "type": "td",\n            "id": "2li9bNcOCB"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "is"\n                  }\n                ],\n                "type": "p",\n                "id": "kfgvfgGDBJ"\n              }\n            ],\n            "type": "td",\n            "id": "SMbUQMP8Hv"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "She's"\n                  }\n                ],\n                "type": "p",\n                "id": "0wBtovXUS8"\n              }\n            ],\n            "type": "td",\n            "id": "gaSAFt0E--"\n          }\n        ],\n        "type": "tr",\n        "id": "nwH_OTDaTz"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "He"\n                  }\n                ],\n                "type": "p",\n                "id": "jT_acwSKFH"\n              }\n            ],\n            "type": "td",\n            "id": "uNXF244q_D"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "is"\n                  }\n                ],\n                "type": "p",\n                "id": "VMdAMgsYGQ"\n              }\n            ],\n            "type": "td",\n            "id": "bJURYjaa6D"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "He's"\n                  }\n                ],\n                "type": "p",\n                "id": "yQaSAEK-O5"\n              }\n            ],\n            "type": "td",\n            "id": "-OpOmRr86L"\n          }\n        ],\n        "type": "tr",\n        "id": "M7vwea-Myg"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "It"\n                  }\n                ],\n                "type": "p",\n                "id": "hzCAp0Sn_D"\n              }\n            ],\n            "type": "td",\n            "id": "kIM-hhUTHe"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "is"\n                  }\n                ],\n                "type": "p",\n                "id": "w0LGWnE8RQ"\n              }\n            ],\n            "type": "td",\n            "id": "9buFVeO3CX"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "It's"\n                  }\n                ],\n                "type": "p",\n                "id": "hn98UrMhV8"\n              }\n            ],\n            "type": "td",\n            "id": "VpD0uwrQZ0"\n          }\n        ],\n        "type": "tr",\n        "id": "W3C2_w6aMC"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "We"\n                  }\n                ],\n                "type": "p",\n                "id": "ERbfPlkN2b"\n              }\n            ],\n            "type": "td",\n            "id": "_c9F9UyyYV"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "are"\n                  }\n                ],\n                "type": "p",\n                "id": "aNqymMhG-N"\n              }\n            ],\n            "type": "td",\n            "id": "JIoj3l-EvW"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "We're"\n                  }\n                ],\n                "type": "p",\n                "id": "CzGMJEaSJ1"\n              }\n            ],\n            "type": "td",\n            "id": "wdRFybb1H2"\n          }\n        ],\n        "type": "tr",\n        "id": "MkkS7jujxr"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "You"\n                  }\n                ],\n                "type": "p",\n                "id": "jM-ZJK4229"\n              }\n            ],\n            "type": "td",\n            "id": "35QjIZjenQ"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "are"\n                  }\n                ],\n                "type": "p",\n                "id": "K4zQWCYpxw"\n              }\n            ],\n            "type": "td",\n            "id": "VPZnnQc7Tw"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "You're"\n                  }\n                ],\n                "type": "p",\n                "id": "lYxDLznBPh"\n              }\n            ],\n            "type": "td",\n            "id": "xBAyP8q4Gp"\n          }\n        ],\n        "type": "tr",\n        "id": "1GigcZm4s_"\n      },\n      {\n        "children": [\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "They"\n                  }\n                ],\n                "type": "p",\n                "id": "ExpEdibAmU"\n              }\n            ],\n            "type": "td",\n            "colSpan": 1,\n            "rowSpan": 1,\n            "id": "AlQ1GkQl2J"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "are"\n                  }\n                ],\n                "type": "p",\n                "id": "iqrW457bUt"\n              }\n            ],\n            "type": "td",\n            "colSpan": 1,\n            "rowSpan": 1,\n            "id": "yKcuidOBAo"\n          },\n          {\n            "children": [\n              {\n                "children": [\n                  {\n                    "text": "They're"\n                  }\n                ],\n                "type": "p",\n                "id": "CVaeiISu2V"\n              }\n            ],\n            "type": "td",\n            "colSpan": 1,\n            "rowSpan": 1,\n            "id": "oofc2O-mXn"\n          }\n        ],\n        "type": "tr",\n        "id": "Qfyo-tUjQ-"\n      }\n    ],\n    "type": "table",\n    "id": "dWXXTAsrIK",\n    "colSizes": [\n      0,\n      120,\n      0\n    ]\n  },\n  {\n    "children": [\n      {\n        "text": ""\n      }\n    ],\n    "type": "p",\n    "id": "KGTC2ilDo2"\n  }\n]	10
\.


--
-- Data for Name: form_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_answers (id, "textAnswer", "selectedOptionIds", "numericAnswer", "booleanAnswer", "questionId", "responseId", "createdAt", "updatedAt", "selectedOptionId", "isCorrect", feedback, score) FROM stdin;
\.


--
-- Data for Name: form_question_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_question_options (id, "optionText", "optionValue", "orderIndex", "imageUrl", color, "isCorrect", "questionId", "createdAt", "updatedAt") FROM stdin;
ee3d0d73-3611-45c6-aa79-2f0b4ba8a08c	washed		0			f	e567ec22-ea5e-48d1-b6b8-b5db2b00a90e	2026-01-19 21:35:16.87476	2026-01-19 21:35:16.87476
f93447e0-4c42-49c0-83cc-a0cdc7e4199b	didn't wash		1			f	e567ec22-ea5e-48d1-b6b8-b5db2b00a90e	2026-01-19 21:35:16.886507	2026-01-19 21:35:16.886507
c5456513-65eb-49ca-af4c-a79e7109d29e	cleaned		2			t	e567ec22-ea5e-48d1-b6b8-b5db2b00a90e	2026-01-19 21:35:16.898217	2026-01-19 21:35:16.898217
36bf72dc-bff8-4495-a043-b06255e05099	didn't clean		3			f	e567ec22-ea5e-48d1-b6b8-b5db2b00a90e	2026-01-19 21:35:16.910361	2026-01-19 21:35:16.910361
ebb0c508-7754-4aee-96d2-bf601d6acd40	washed		0			f	d2729c90-da88-43d3-85e1-8f1e63b296fd	2026-01-19 21:35:16.934336	2026-01-19 21:35:16.934336
2c6e4032-0704-4eb1-9f4c-3c9b4f224412	didn't wash		1			t	d2729c90-da88-43d3-85e1-8f1e63b296fd	2026-01-19 21:35:16.94627	2026-01-19 21:35:16.94627
625aa8d5-75a9-496a-ade4-d24e26bbc358	cleaned		2			f	d2729c90-da88-43d3-85e1-8f1e63b296fd	2026-01-19 21:35:16.958474	2026-01-19 21:35:16.958474
81604802-b506-48fb-8eff-8b5ec2a9053b	didn't clean		3			f	d2729c90-da88-43d3-85e1-8f1e63b296fd	2026-01-19 21:35:16.970484	2026-01-19 21:35:16.970484
ca4e9066-1b76-4adc-bcde-43da77fb1058	liked		0			f	f5a8d80f-b60c-427d-a85f-27528d4d4d97	2026-01-19 21:35:16.994581	2026-01-19 21:35:16.994581
3183c5a7-dd75-4fc4-a7cb-15db4baf788b	didn't like		1			f	f5a8d80f-b60c-427d-a85f-27528d4d4d97	2026-01-19 21:35:17.006543	2026-01-19 21:35:17.006543
44013783-54b5-4cf5-9290-3802a95b35fd	cooked		2			t	f5a8d80f-b60c-427d-a85f-27528d4d4d97	2026-01-19 21:35:17.018279	2026-01-19 21:35:17.018279
d137bc60-2246-44dc-95a6-0c06ce5abeea	didn't cook		3			f	f5a8d80f-b60c-427d-a85f-27528d4d4d97	2026-01-19 21:35:17.030221	2026-01-19 21:35:17.030221
f9fc950c-1d0a-4000-9d14-72d95a5dbe1d	walked		0			t	7810ebeb-4e41-4c2b-b76d-379b376b2035	2026-01-19 21:35:17.053037	2026-01-19 21:35:17.053037
032c737c-aaf5-49d9-844d-8b40ed098a34	cleaned		1			f	7810ebeb-4e41-4c2b-b76d-379b376b2035	2026-01-19 21:35:17.060348	2026-01-19 21:35:17.060348
105528f7-23d6-4cce-85fa-dfad67fd86a8	practiced		2			f	7810ebeb-4e41-4c2b-b76d-379b376b2035	2026-01-19 21:35:17.072257	2026-01-19 21:35:17.072257
6b197f00-d5dc-4143-9225-c645b3f2d229	stayed		3			f	7810ebeb-4e41-4c2b-b76d-379b376b2035	2026-01-19 21:35:17.084272	2026-01-19 21:35:17.084272
\.


--
-- Data for Name: form_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_questions (id, "questionText", "questionType", "orderIndex", "isRequired", description, placeholder, "imageUrl", "minValue", "maxValue", "minLabel", "maxLabel", "maxLength", "allowMultiline", "correctAnswer", "correctOptionIds", explanation, "incorrectFeedback", points, "formId", "createdAt", "updatedAt", "audioUrl") FROM stdin;
984dc229-5c76-416d-9c75-b82631ae8570	1. Did you wash the dishes? 	open_text	0	f			\N	\N	\N	\N	\N	255	f	\N	\N	\N	\N	\N	512425e1-0352-4d40-bdeb-13bbbc78d82f	2025-10-23 17:47:21.634276	2025-10-23 17:47:21.634276	\N
07a4d57e-de14-4f46-a4c1-405b6208a087	Clean	OPEN_TEXT	0	f		Check your spelling and use of capital letters.		0	0			0	f	Cleaned	\N	Add -ed at the end of regular verbs.		0.90	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.135603	2026-01-16 20:47:51.135603	
891eb9ba-845c-4eba-a13d-d16190354bb4	Walk 	OPEN_TEXT	1	f		Check your spelling and use of capital letters.		0	0			0	f	Walked	\N	Add -ed at the end of regular verbs.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.147468	2026-01-16 20:47:51.147468	
5d62734f-d92a-48cf-b411-ae07bf83eec5	Listen	OPEN_TEXT	2	f		Check your spelling and use of capital letters.		0	0			0	f	Listened	\N	Add -ed at the end of regular verbs.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.159528	2026-01-16 20:47:51.159528	
27bf7f19-ed78-4b5a-b167-2e3de4113b30	Can you swim?	TEXT	0	t			\N	\N	\N	\N	\N	255	f	Yes, I can swim.	\N	\N	\N	0.10	daae03b7-50a8-4b8f-a8ce-8fb6a5709868	2025-10-27 23:19:14.757976	2025-10-27 23:19:14.757976	\N
ed8c3952-2394-4daf-a415-d369e9ee358c	Play	OPEN_TEXT	3	f		Check your spelling and use of capital letters.		0	0			0	f	Played	\N	Add -ed at the end of verbs with a final vowel + -y.		0.90	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.171355	2026-01-16 20:47:51.171355	
404952a3-1057-40b1-8f72-0e99c9849284	Watch	OPEN_TEXT	4	f		Check your spelling and use of capital letters.		0	0			0	f	Watched	\N	Add -ed at the end of regular verbs.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.183442	2026-01-16 20:47:51.183442	
728df3af-e630-4cc7-8dd6-0e46d526b038	Study	OPEN_TEXT	5	f		Check your spelling and use of capital letters.		0	0			0	f	Studied	\N	 Change -y to -i and add -ed at the end of verbs with a final consonant + -y.		0.90	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.19544	2026-01-16 20:47:51.19544	
60f2dc14-c43e-44e9-966c-be59d49cf470	Decide	OPEN_TEXT	6	f		Check your spelling and use of capital letters.		0	0			0	f	Decided	\N	Add -d at the end of verbs with final -e.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.207423	2026-01-16 20:47:51.207423	
04a59011-46d5-48e0-b9dc-aaa257803991		MULTIPLE_CHOICE	0	t				0	0			0	f		\N			0.00	743650b1-d47c-4abb-ae0d-dbf596cfd12f	2025-09-26 16:16:24.75907	2025-09-26 16:16:24.75907	\N
fb86de66-8949-4e2c-b665-c278212c6e00	Can you swim?	OPEN_TEXT	0	t				0	0			0	f	 No, I can't swim.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.710691	2025-10-27 23:51:58.710691	
5ec529d3-ad5f-464e-afa2-78037f2ce4e2	Can your dog sit?	OPEN_TEXT	1	t				0	0			0	f	No, my dog can't sit.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.722371	2025-10-27 23:51:58.722371	
41b423be-0e81-4758-b5a6-1d46c16fc485	Can the students spell words in English?	OPEN_TEXT	2	t				0	0			0	f	No, the students can't spell words in English.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.734268	2025-10-27 23:51:58.734268	
ce2cec6a-b1ea-4d00-978f-0088bcb5cdd2	Can you cook for 10 people?\n	OPEN_TEXT	3	t				0	0			0	f	No, I can't cook fore 10 people.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.746376	2025-10-27 23:51:58.746376	
b44d1600-e03c-44cd-a3e7-564822909cee	Can your grandmother walk very well?	OPEN_TEXT	4	t				0	0			0	f	No, my grandmother can't walk very well.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.758357	2025-10-27 23:51:58.758357	
525edea2-108d-44dd-8ee0-0581a523cdde	Relax	OPEN_TEXT	7	f		Check your spelling and use of capital letters.		0	0			0	f	Relaxed	\N	Add -ed at the end of regular verbs.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.219384	2026-01-16 20:47:51.219384	
61406c09-13a5-42ad-b0c1-34ff7b271181	Plan	OPEN_TEXT	8	f		Check your spelling and use of capital letters.		0	0			0	f	Planned	\N	Double the last consonant and add -ed at the end of some verbs with final consonant + vowel + consonant.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.231435	2026-01-16 20:47:51.231435	
4e0efec0-a61a-40b4-9ffd-d96f19a1221a	Answer	OPEN_TEXT	9	f		Check your spelling and use of capital letters.		0	0			0	f	Answered	\N	Add -ed at the end of regular verbs.		0.90	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.243327	2026-01-16 20:47:51.243327	
5836daf0-640b-4c3c-8677-c255dae98917	Close	OPEN_TEXT	10	f		Check your spelling and use of capital letters.		0	0			0	f	Closed	\N	Add -d at the end of verbs with final -e.		0.90	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.255345	2026-01-16 20:47:51.255345	
9fcfd9e5-1d9e-435a-8f27-77c70a9bb295	Arrive	OPEN_TEXT	11	f		Check your spelling and use of capital letters.		0	0			0	f	Arrived	\N	Add -d at the end of verbs with final -e.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.267444	2026-01-16 20:47:51.267444	
f9d5c591-bba6-4612-ab2e-d982cb4df6a5	Work	OPEN_TEXT	12	f		Check your spelling and use of capital letters.		0	0			0	f	Worked	\N	Add -ed at the end of regular verbs.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.279387	2026-01-16 20:47:51.279387	
d3c789a1-6303-4034-ad18-16a5390fefbc	Open	OPEN_TEXT	13	f		Check your spelling and use of capital letters.		0	0			0	f	Opened	\N	Add -ed at the end of regular verbs.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.29137	2026-01-16 20:47:51.29137	
9f05ca0d-d0f5-42f8-b702-c0b2e90acc8a	Stay	OPEN_TEXT	14	f		Check your spelling and use of capital letters.		0	0			0	f	Stayed	\N	Add -ed at the end of verbs with a final vowel + -y.		1.00	47ace307-d32f-4201-9304-0221e8df1fcb	2026-01-16 20:47:51.303439	2026-01-16 20:47:51.303439	
e567ec22-ea5e-48d1-b6b8-b5db2b00a90e	Jilly had a very busy week. On Monday, she ** her house because it was really messy after the weekend.\n	MULTIPLE_CHOICE	0	f				0	0			0	f		\N	"to wash the house" is not a natural combination in English.\n		1.00	39e9b3c3-7e6b-4151-a857-7d0afffcc39d	2026-01-19 21:35:16.862833	2026-01-19 21:35:16.862833	
d2729c90-da88-43d3-85e1-8f1e63b296fd	She __________ her clothes because it was raining, so the clothes were still dirty on Tuesday.	MULTIPLE_CHOICE	1	f				0	0			0	f		\N	"To clean the clothes" is not a natural combination in English.\n		1.00	39e9b3c3-7e6b-4151-a857-7d0afffcc39d	2026-01-19 21:35:16.922461	2026-01-19 21:35:16.922461	
f5a8d80f-b60c-427d-a85f-27528d4d4d97	On Tuesday, she ** her lunch for the rest of the week. She usually eats lunch at school.	MULTIPLE_CHOICE	2	f				0	0			0	f		\N			0.00	39e9b3c3-7e6b-4151-a857-7d0afffcc39d	2026-01-19 21:35:16.98258	2026-01-19 21:35:16.98258	
7810ebeb-4e41-4c2b-b76d-379b376b2035		MULTIPLE_CHOICE	3	f				0	0			0	f		\N			0.00	39e9b3c3-7e6b-4151-a857-7d0afffcc39d	2026-01-19 21:35:17.041045	2026-01-19 21:35:17.041045	
25d4eece-36fa-4858-b2f4-b85825c2eb31	I stayed there all afternoon. 	MULTIPLE_CHOICE	4	f				0	0			0	f		\N			0.00	39e9b3c3-7e6b-4151-a857-7d0afffcc39d	2026-01-19 21:35:17.095191	2026-01-19 21:35:17.095191	
aa2524e8-1ad5-4196-b0a2-6cb31a2bc55f	Can you swim?	OPEN_TEXT	0	t				0	0			0	f	Yes, I can swim.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.072347	2025-10-27 23:35:53.072347	
4a996e0c-3c3f-47ad-bc71-d49a9dd06102	Can your dog sit?	OPEN_TEXT	1	t				0	0			0	f	Yes, my dog can sit.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.087896	2025-10-27 23:35:53.087896	
8fe986d4-3f3a-4c1f-8a5d-d0791502240b	Can the students spell words in English?	OPEN_TEXT	2	t				0	0			0	f	Yes, the students can spell words in English.	\N			0.00	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.101624	2025-10-27 23:35:53.101624	
e2f50634-ee84-404f-8947-479877815c93	 Can you cook for 10 people?	OPEN_TEXT	3	t				0	0			0	f	Yes, I can cook for 10 people.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.113044	2025-10-27 23:35:53.113044	
2733966b-5069-4b63-9520-b9242df302f9	Can your grandmother walk very well?	OPEN_TEXT	4	t				0	0			0	f	Yes, my grandmother can walk very well.	\N			0.00	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.125181	2025-10-27 23:35:53.125181	
41a0d8e8-8b92-400b-9ca6-94e6b34f7eff	Can your father use a computer?	OPEN_TEXT	5	t				0	0			0	f	Yes, my father can use a computer.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.137028	2025-10-27 23:35:53.137028	
c423ca00-ce38-46c2-8a59-04cbcacd79ad	Can you sing opera?	OPEN_TEXT	6	t				0	0			0	f	Yes, I can sing opera.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.149134	2025-10-27 23:35:53.149134	
833cd7bc-3c83-4c62-89d2-1afbe2cf32ec	Can your classmates help you?	OPEN_TEXT	7	t				0	0			0	f	Yes, my classmates can help me.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.161134	2025-10-27 23:35:53.161134	
0e9dcf7a-d520-44d2-9eba-df9fef0113bf	Can you smoke at school?	OPEN_TEXT	8	t				0	0			0	f	Yes, I can smoke at school.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.173081	2025-10-27 23:35:53.173081	
0f8f79a3-0fb0-4ad8-b8d2-479be986eb1c	Can you take a cold shower?	OPEN_TEXT	9	t				0	0			0	f	Yes, I can take a cold shower.	\N			0.10	c43d8fe3-9cfc-435a-ad23-c873eb6fe542	2025-10-27 23:35:53.185089	2025-10-27 23:35:53.185089	
3c344596-c64b-4273-ba1a-7fa906982bf3	Can your father use a computer? 	OPEN_TEXT	5	t				0	0			0	f	No, my father can't use a computer. 	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.770249	2025-10-27 23:51:58.770249	
f5024f48-dbcf-4614-bca8-43acea0e2d8d	Can you sing opera?\n	OPEN_TEXT	6	t				0	0			0	f	No, I can't sing opera.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.78235	2025-10-27 23:51:58.78235	
7088b4a2-a66e-42f0-b4d1-d58cbbe036ae	Can your classmates help you?	OPEN_TEXT	7	t				0	0			0	f	No, my classmates can't help me.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.794433	2025-10-27 23:51:58.794433	
a1510bbc-d48c-45f4-b601-e9bdaccdb243	Can you smoke at school?	OPEN_TEXT	8	t				0	0			0	f	No, I can't smoke at school.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.806316	2025-10-27 23:51:58.806316	
3ea9b032-8334-4bff-a873-7e0066c0489c	Can you take a cold shower?	OPEN_TEXT	9	t				0	0			0	f	No, I can't take a cold shower.	\N			0.10	9398b1e4-4717-4a40-abbc-760c15c8a048	2025-10-27 23:51:58.81848	2025-10-27 23:51:58.81848	
9001be69-490b-4858-9452-689d156cff2e		WORD_SEARCH	0	f				0	0			0	f		\N			0.00	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	2026-01-13 22:53:11.135823	2026-01-13 22:53:11.135823	
c5b61f85-bfee-4262-96c7-db173c302053	My father and I *wash* the car together last Saturday morning.	OPEN_TEXT	0	f		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	My father and I washed the car together last Saturday morning.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.876758	2026-01-14 01:57:20.876758	
02c4f5d7-e89a-44b7-b3ac-3fc73c065f27	My daughter *need* a new bicycle, so I gave her mine.	OPEN_TEXT	1	f				0	0			0	f	My daughter needed a new bicycle, so I gave her mine.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.88946	2026-01-14 01:57:20.88946	
33d57382-1289-4f99-aa53-881eba8dd7fb	I'm sure I *brush* my teeth last night.	OPEN_TEXT	2	f		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	I'm sure I brushed my teeth last night.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.900633	2026-01-14 01:57:20.900633	
bf48bf22-d56f-40b2-b29e-e25e2211063f	R*d	OPEN_TEXT	0	f				0	0			0	f	Red	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.755748	2025-11-06 19:04:04.755748	
ea0b7114-9dd2-4f67-96f3-fd0852ab44b1	Y*ll*w	OPEN_TEXT	1	f				0	0			0	f	Yellow	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.767524	2025-11-06 19:04:04.767524	
d30c140b-3f07-4cfc-ba4c-5388b1d0c575	Bl*e	OPEN_TEXT	2	f				0	0			0	f	Blue	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.779458	2025-11-06 19:04:04.779458	
e4b6bd9f-3329-427e-be7a-f8225251a4a7	Gr**n	OPEN_TEXT	3	f				0	0			0	f	Green	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.791533	2025-11-06 19:04:04.791533	
1a12a401-96fb-43a3-abd7-ee81d9769186	P*nk	OPEN_TEXT	4	f				0	0			0	f	Pink	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.803286	2025-11-06 19:04:04.803286	
2128f39d-5ce2-4d14-bb6c-571e5f3f1c92	Pu*pl*	OPEN_TEXT	5	f				0	0			0	f	Purple	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.815373	2025-11-06 19:04:04.815373	
0f9e23fe-d45c-4eb1-90e7-8509192afe65	Or*n*e	OPEN_TEXT	6	f				0	0			0	f	Orange	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.827503	2025-11-06 19:04:04.827503	
d8a529c3-924b-4d41-91bf-9b199f1f7d53	B*a*k	OPEN_TEXT	7	f				0	0			0	f	Black	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.839361	2025-11-06 19:04:04.839361	
cbfcb43d-3b4d-4348-b9eb-478bbe67d107	W*i*e	OPEN_TEXT	8	f				0	0			0	f	White	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.85129	2025-11-06 19:04:04.85129	
ed3f563a-3c40-4a86-a70a-98477c4e2709	Gr*y	OPEN_TEXT	9	f				0	0			0	f	Gray	\N	Pay attention to the spelling.		1.00	d03c7914-c9db-4e1e-aef5-8d084fe9388b	2025-11-06 19:04:04.863962	2025-11-06 19:04:04.863962	
661bf1dd-cd2e-4b0a-9a2b-46cb4d06cd02	My wife *cook* something delicious for dinner last night.	OPEN_TEXT	3	t		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	My wife cooked something delicious for dinner last night.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.912686	2026-01-14 01:57:20.912686	
c007cfe0-8e29-4119-b5ac-0ac5e3b35502	We *stay* at a very cheap hotel on our last vacation, but it was really clean and comfortable.	OPEN_TEXT	4	t		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	We stayed at a very cheap hotel on our last vacation, but it was really clean and comfortable.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.924725	2026-01-14 01:57:20.924725	
284aa337-2af0-47b1-9144-464d6a54d4af	Matthew *learn* Portuguese on his trip to Brazil last year.	OPEN_TEXT	5	t		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	Matthew learned Portuguese on his trip to Brazil last year.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.936691	2026-01-14 01:57:20.936691	
0a690ecf-b300-4c7c-919e-e9a676acdb28	The movie *finish* very late, so we went straight home.	OPEN_TEXT	6	t		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	The movie finished very late, so we went straight home.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.948643	2026-01-14 01:57:20.948643	
dff59348-8d9f-4bf6-ac7a-b39f2db47017	My best friend *travel* to Egypt last summer.	OPEN_TEXT	7	t				0	0			0	f		\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.9607	2026-01-14 01:57:20.9607	
80bfda36-bc8d-4914-962a-16e91d2287ca	Sally *start* her day with a healthy breakfast.	OPEN_TEXT	8	f		Check your spelling. Do not use stars (*) in the answer.		0	0			13	f	Sally started her day with a healthy breakfast.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.984433	2026-01-14 01:57:20.984433	
5e3bc7b8-3d72-428a-b4a3-cb8cac4cd641	I'm exhausted, but I *clean* the whole house.	OPEN_TEXT	9	f		Check your spelling. Do not use stars (*) in the answer.		0	0			0	f	I'm exhausted, but I cleaned the whole house.	\N	Add -ed at the end of regular verbs in simple past.		1.00	c4065a01-d36e-49fe-84e4-6e8fb0074eed	2026-01-14 01:57:20.996293	2026-01-14 01:57:20.996293	
5d020b34-e49c-4a13-9e67-66bc37e15e1b	We *clean* all the house last Saturday.	OPEN_TEXT	0	f		clean = regular verb		0	0			0	f	cleaned	\N	Regular verbs in past add -ed at the end		1.00	813097d1-0243-40e3-9eab-a0719d2409a7	2026-01-16 20:58:53.825647	2026-01-16 20:58:53.825647	
c938f685-8f70-474b-95d0-b15303935c13	I *travel* to Brazil last year.	OPEN_TEXT	1	f		travel = regular verb		0	0			0	f	traveled	\N	Regular verbs in past add -ed at the end		1.00	813097d1-0243-40e3-9eab-a0719d2409a7	2026-01-16 20:58:53.837465	2026-01-16 20:58:53.837465	
e6bddc72-537d-44bf-84f5-d06bfaf8b98b	He *call* his girlfriend last night.	OPEN_TEXT	2	f		call = regular verb.		0	0			0	f	called	\N	Regular verbs in past add -ed at the end		1.00	813097d1-0243-40e3-9eab-a0719d2409a7	2026-01-16 20:58:53.84987	2026-01-16 20:58:53.84987	
1e3667e9-92b4-498b-a2e1-bac3928ac812	He *start* a new book two days ago.	OPEN_TEXT	3	f		start = regular verb		0	0			0	f	started	\N	Regular verbs in past add -ed at the end		1.00	813097d1-0243-40e3-9eab-a0719d2409a7	2026-01-16 20:58:53.861641	2026-01-16 20:58:53.861641	
d4fe1a27-190a-475a-877c-a4e4c07b9722	They *plan* a surprise party for my birthday.	OPEN_TEXT	4	f		plan = regular verb		0	0			0	f	planned	\N	the verb "plan" ends in consonant + vowel + consonant		1.00	813097d1-0243-40e3-9eab-a0719d2409a7	2026-01-16 20:58:53.873576	2026-01-16 20:58:53.873576	
\.


--
-- Data for Name: form_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_responses (id, "respondentName", "respondentEmail", "isAnonymous", "ipAddress", "userAgent", status, "startedAt", "completedAt", "formId", "userId", "createdAt", "updatedAt") FROM stdin;
f8889d76-9694-41f0-b225-fe67513225de	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-19 20:39:25.114199	2025-09-19 20:39:25.114199
be94b6bd-7760-4f51-b803-be0ae7c92e45	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-19 20:42:15.425777	2025-09-19 20:42:15.425777
7ac5e6ae-77b2-4d0c-b15a-a677453fea52	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-24 20:47:50.55867	2025-09-24 20:47:50.55867
f10e4ad2-8cce-4205-85ae-7e944ccf9c49	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-24 20:51:09.705673	2025-09-24 20:51:09.705673
b288c1b0-0171-4bdc-a42b-265c701b5b69	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-24 20:51:18.825706	2025-09-24 20:51:18.825706
a09d6067-b3e2-430b-8900-a0a35fc13ff3	Maestro Mario Eduardo S??nchez Mej??a	maestro@unam.mx	f	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-24 21:26:14.737977	2025-09-24 21:26:14.737977
5bffd37c-a00b-49bd-9473-d39d8c0d5c96	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-24 21:35:36.90853	2025-09-24 21:35:36.90853
f968fbbc-2a6d-4070-bbfc-9a2f790daef8	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-26 02:04:21.785659	2025-09-26 02:04:21.785659
462c8404-6c39-4192-b5d3-43119a9ecea3	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-26 02:05:02.804786	2025-09-26 02:05:02.804786
34b96315-5bc2-4238-a503-fde25386e7bd	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	50dcc037-4647-4a60-84a9-1bd6c0f2a58e	\N	2025-09-26 17:01:42.431039	2025-09-26 17:01:42.431039
10134eb2-4a27-448f-b4de-33ff539e151d	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	c4065a01-d36e-49fe-84e4-6e8fb0074eed	\N	2025-10-23 21:07:41.546952	2025-10-23 21:07:41.546952
c9a27074-05b5-40ed-b816-bf039e63070a	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	c4065a01-d36e-49fe-84e4-6e8fb0074eed	\N	2025-10-24 20:01:39.120791	2025-10-24 20:01:39.120791
11a7d321-258d-422c-b885-f8dbe04899a8	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	c4065a01-d36e-49fe-84e4-6e8fb0074eed	\N	2025-10-24 20:03:55.74408	2025-10-24 20:03:55.74408
516e27a4-2c40-49ff-9c0b-bc68e6fae55f	Angel De Jesus alcantar Garza	rayoalcantar@gmail.com	f	\N	\N	completed	\N	\N	c4065a01-d36e-49fe-84e4-6e8fb0074eed	\N	2025-10-24 20:28:44.256413	2025-10-24 20:28:44.256413
b68713fb-ce06-4f94-8ab3-866f90a94039	Usuario An??nimo	anonimo@sistema.local	t	\N	\N	completed	\N	\N	c4065a01-d36e-49fe-84e4-6e8fb0074eed	\N	2025-10-24 23:56:17.691715	2025-10-24 23:56:17.691715
\.


--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forms (id, title, description, status, "allowAnonymous", "allowMultipleResponses", "successMessage", "backgroundColor", "textColor", "fontFamily", "publishedAt", "closedAt", "contentId", "userId", "createdAt", "updatedAt") FROM stdin;
50dcc037-4647-4a60-84a9-1bd6c0f2a58e	Formulario para VERB BE	Formulario generado autom??ticamente para la actividad: VERB BE	published	t	t	\N	\N	\N	\N	\N	\N	aef14eed-be25-4921-b3ad-a278305060c5	\N	2025-09-19 20:30:46.747365	2025-09-19 20:30:46.747365
743650b1-d47c-4abb-ae0d-dbf596cfd12f	Formulario para Prueba Docentes	Formulario generado autom??ticamente para la actividad: Prueba Docentes	published	t	t	\N	\N	\N	\N	\N	\N	aef14eed-be25-4921-b3ad-a278305060c5	\N	2025-09-26 16:14:46.400002	2025-09-26 16:14:46.400002
512425e1-0352-4d40-bdeb-13bbbc78d82f	Formulario para Simple past regular verbs	Formulario generado autom??ticamente para la actividad: Simple past regular verbs	published	t	t	\N	\N	\N	\N	\N	\N	7dff62d7-c7e8-45cc-9af5-1777807e9c07	\N	2025-10-23 17:44:13.233046	2025-10-23 17:44:13.233046
c4065a01-d36e-49fe-84e4-6e8fb0074eed	Formulario para Simple past regular verbs	Formulario generado autom??ticamente para la actividad: Simple past regular verbs	published	t	t	\N	\N	\N	\N	\N	\N	7dff62d7-c7e8-45cc-9af5-1777807e9c07	\N	2025-10-23 17:50:26.502253	2025-10-23 17:50:26.502253
813097d1-0243-40e3-9eab-a0719d2409a7	Formulario para Regular verbs in past.	Formulario generado autom??ticamente para la actividad: Regular verbs in past.	published	t	t	\N	\N	\N	\N	\N	\N	7dff62d7-c7e8-45cc-9af5-1777807e9c07	\N	2025-10-24 06:15:31.055813	2025-10-24 06:15:31.055813
47ace307-d32f-4201-9304-0221e8df1fcb	Formulario para Regular verbs	Formulario generado autom??ticamente para la actividad: Regular verbs	published	t	t	\N	\N	\N	\N	\N	\N	7dff62d7-c7e8-45cc-9af5-1777807e9c07	\N	2025-10-27 22:54:02.030958	2025-10-27 22:54:02.030958
daae03b7-50a8-4b8f-a8ce-8fb6a5709868	Formulario para Can, can't	Formulario generado autom??ticamente para la actividad: Can, can't	published	t	t	\N	\N	\N	\N	\N	\N	d9094da6-250c-43d4-a4b7-f8dc53bbedec	\N	2025-10-27 23:16:36.300955	2025-10-27 23:16:36.300955
c43d8fe3-9cfc-435a-ad23-c873eb6fe542	Formulario para Can, can't. Affirmative	Formulario generado autom??ticamente para la actividad: Can, can't. Affirmative	published	t	t	\N	\N	\N	\N	\N	\N	d9094da6-250c-43d4-a4b7-f8dc53bbedec	\N	2025-10-27 23:28:07.186098	2025-10-27 23:28:07.186098
9398b1e4-4717-4a40-abbc-760c15c8a048	Formulario para Can, can't. Negative	Formulario generado autom??ticamente para la actividad: Can, can't. Negative	published	t	t	\N	\N	\N	\N	\N	\N	d9094da6-250c-43d4-a4b7-f8dc53bbedec	\N	2025-10-27 23:41:11.09517	2025-10-27 23:41:11.09517
d03c7914-c9db-4e1e-aef5-8d084fe9388b	Formulario para COLORS EXERCISE 1	Formulario generado autom??ticamente para la actividad: COLORS EXERCISE 1	published	t	t	\N	\N	\N	\N	\N	\N	8f0cfafa-77d8-4e51-bfe8-3badbc945639	\N	2025-11-06 18:53:49.357352	2025-11-06 18:53:49.357352
39e9b3c3-7e6b-4151-a857-7d0afffcc39d	Formulario para Simple past. Regular verbs. Exercise 3.	Formulario generado autom??ticamente para la actividad: Simple past. Regular verbs. Exercise 3.	published	t	t	\N	\N	\N	\N	\N	\N	7dff62d7-c7e8-45cc-9af5-1777807e9c07	\N	2026-01-16 23:21:02.221364	2026-01-16 23:21:02.221364
\.


--
-- Data for Name: lenguages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lenguages (id, name, eslogan_atractivo, descripcion_corta, descripcion_completa, nivel, duracion_total_horas, color_tema, icono_curso, imagen_hero, badge_destacado, idioma_origen, idioma_destino, certificado_digital, puntuacion_promedio, total_estudiantes_inscritos, estado, featured, fecha_creacion, fecha_actualizacion, icons, "isActive", "createdAt", "updatedAt", "calculatedTotalTime") FROM stdin;
ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	Ingl??s	Come learn with us!	\N	\N	Básico	\N	#000000	\N	\N	\N	\N	\N	f	0.00	0	Activo	f	2025-09-19 18:54:02.441044	2026-01-19 21:35:17.191484	\N	t	2025-09-19 18:54:02.441044	2025-09-19 18:54:02.441044	105
\.


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.levels (id, name, description, "isCompleted", percentaje, qualification, "createdAt", "updatedAt", "userId", "isActive", difficulty, "lenguageId", "calculatedTotalTime") FROM stdin;
912b2be1-3b43-4f6b-b250-e2aa336328e8	A1	Nivel inicial para principiantes.	f	0	0	2025-09-19 19:02:06.325363	2026-01-22 22:16:43.438177	-1	t	B??sico	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	105
\.


--
-- Data for Name: plate_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plate_comments (id, comment, "commentRich", "contentId", "userId", "textSelection", "selectedText", "position", "isResolved", "isEdited", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (id, name, description, color, "imageUrl", icon, objectives, prerequisites, difficulty, "estimatedHours", tags, "isActive", "levelId", "lenguageId", "createdAt", "updatedAt", "calculatedTotalTime") FROM stdin;
f048fa3f-1ac7-4421-aad5-60eb047eb676	Listening		#3B82F6	\N	\N	\N	\N	B??sico	\N	{}	t	912b2be1-3b43-4f6b-b250-e2aa336328e8	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	2025-09-26 01:58:52.247494	2025-09-26 16:15:14.630987	0
66bbf5fb-8f39-429b-8ac1-e8f2e440d28f	Vocabulary	Aprende y pr??ctica nuevas palabras, frases y expresiones.	#3B82F6	\N	\N	\N	\N	B??sico	\N	{}	t	912b2be1-3b43-4f6b-b250-e2aa336328e8	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	2025-10-02 21:04:09.35743	2026-01-22 22:16:38.152298	10
e8de288c-49f7-45bb-ad06-3b20ae54275b	Grammar	Estudia reglas gramaticales y ponlas en pr??ctica con nuestros ejercicios.	#3B82F6	\N	\N	\N	\N	B??sico	\N	{}	t	912b2be1-3b43-4f6b-b250-e2aa336328e8	ccbb3cc7-5f7d-48c0-aecf-1244c6c11777	2025-09-19 19:12:25.043776	2026-01-22 22:16:43.450618	95
\.


--
-- Data for Name: user_activity_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_activity_history (id, "userId", "contentId", "activityId", "formResponseId", status, score, "maxScore", "timeSpent", "attemptNumber", "answeredQuestionIds", "correctAnswerIds", "startedAt", "completedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_assigned_languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_assigned_languages ("userId", "languageId") FROM stdin;
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, "userId", "contentId", "progressPercentage", "completedActivities", "totalActivities", "completedActivityIds", "formResponseIds", "isCompleted", "lastActivityAt", "completedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "fullName", email, password, roles, "isActive", "assignedLanguageId", "lastUpdateBy") FROM stdin;
7db7f107-a5c3-4005-8249-f16c6f698dab	Mario Eduardo S??nchez Mej??a	a@b.com	$2b$10$gc4ybOZib3eMeIP6uZF.Iequ3d6qmY10QogP10ElmuvDfkTYakv.i	{superUser}	t	\N	b35e5b8a-4a60-469a-b514-df06d6096f0d
b35e5b8a-4a60-469a-b514-df06d6096f0d	Gabriela Trejo P??rez 	gabytp76@gmail.com	$2b$10$BcbGDZ6RygnGjAdszd7h/emYcDEOzkgQ4PpMdLisxBdabrIa8zsRe	{superUser}	t	\N	7db7f107-a5c3-4005-8249-f16c6f698dab
9d7b30f0-8106-4f70-b5b9-07fa87e532d1	Andrea Jim??nez 	andrea.jimenez@uasb.edu.ec	$2b$10$fBlzDbg0s/jvjC3wNSM5a.PP3v7giE6XgQF50j2LYXtDsjmJhzVdK	{mortal}	t	\N	\N
94a6c449-62ab-4158-af0d-3e7c3640cc36	Angel De Jesus alcantar Garza	rayoalcantar@gmail.com	$2b$10$oRF5BmmMzUn0v02dJ1YnY.LlYby30g/FG.GsG2vjB6y3fW7LlnIv2	{mortal}	t	\N	\N
152974f4-bdce-4c79-9f3c-3853132d19b0	Alberto Tapia Lucachin	cle.ingles.tapia@aragon.unam.mx	$2b$10$c.m8dVL3pppzDzVzkuLXAukqaOlGOMf0VmqTzTbCOiz6qe1n1jTIS	{docente}	t	\N	b35e5b8a-4a60-469a-b514-df06d6096f0d
9156ac75-ab60-46ff-8bdd-827841625893	Gabriela Trejo P??rez	eskani@enesmorelia.unam.mx	$2b$10$2sCRPxk2bfQVRzQcMOg/W.DMipt9yjaMdOEAeNJsQd.zdNGLHrg9y	{superUser}	t	\N	7db7f107-a5c3-4005-8249-f16c6f698dab
5069279b-67f2-4f27-9730-dd786ca68443	Karina Godina Sep??lveda	kgodina@enesmorelia.unam.mx	$2b$10$1UbCe75nWTlZhcU7OiHgB.rEX7kN9ovuy65E/ebcbWI76Hq7CNDsq	{docente}	t	\N	b35e5b8a-4a60-469a-b514-df06d6096f0d
9902423e-b0c5-4952-9f48-f6bed3899538	Azucena Luna Estrada	cle.ingles.luna@aragon.unam.mx	$2b$10$1zzG4GK1yjH6DuSf7H3mfeX1xO.47ANaztWikJJjKAqlxB4Y6uAEm	{docente}	t	\N	b35e5b8a-4a60-469a-b514-df06d6096f0d
a45332cc-ddba-43d4-8009-da701b1da38b	Maestro Mario Eduardo S??nchez Mej??a	maestro@unam.mx	$2b$10$Pmg78S5qDxqfAXgIy1IOT.au0RBO8AL5qgfWCYMuWbOaqrgwbRBna	{docente}	t	\N	7db7f107-a5c3-4005-8249-f16c6f698dab
41d72bdf-4842-41da-85fb-e0d26d4c48d1	Gabriela Trejo P??rez	gtrejo@enesmorelia.unam.mx	$2b$10$V6FuYUoibWulHYzei7i0muI24q3WB.8bD4GNSBaOCWMgZjvPrWGJq	{docente}	t	\N	7db7f107-a5c3-4005-8249-f16c6f698dab
\.


--
-- Name: levels PK_05f8dd8f715793c64d49e3f1901; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT "PK_05f8dd8f715793c64d49e3f1901" PRIMARY KEY (id);


--
-- Name: skills PK_0d3212120f4ecedf90864d7e298; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY (id);


--
-- Name: form_responses PK_36a512e5574d0a366b40b26874e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses
    ADD CONSTRAINT "PK_36a512e5574d0a366b40b26874e" PRIMARY KEY (id);


--
-- Name: content_teachers PK_601ea8e97808fef284f9bfadf79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_teachers
    ADD CONSTRAINT "PK_601ea8e97808fef284f9bfadf79" PRIMARY KEY ("contentId", "teacherId");


--
-- Name: user_activity_history PK_7720a890d0eeca5ea50d2b8b9c5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activity_history
    ADD CONSTRAINT "PK_7720a890d0eeca5ea50d2b8b9c5" PRIMARY KEY (id);


--
-- Name: form_questions PK_79b081029ae61e3761034f88c85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_questions
    ADD CONSTRAINT "PK_79b081029ae61e3761034f88c85" PRIMARY KEY (id);


--
-- Name: user_progress PK_7b5eb2436efb0051fdf05cbe839; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT "PK_7b5eb2436efb0051fdf05cbe839" PRIMARY KEY (id);


--
-- Name: activities PK_7f4004429f731ffb9c88eb486a8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY (id);


--
-- Name: lenguages PK_9aecb24c4e1acd514c7a50c4fc0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lenguages
    ADD CONSTRAINT "PK_9aecb24c4e1acd514c7a50c4fc0" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: user_assigned_languages PK_a66b25b3aa7f573fac201e4341a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_assigned_languages
    ADD CONSTRAINT "PK_a66b25b3aa7f573fac201e4341a" PRIMARY KEY ("userId", "languageId");


--
-- Name: contents PK_b7c504072e537532d7080c54fac; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "PK_b7c504072e537532d7080c54fac" PRIMARY KEY (id);


--
-- Name: forms PK_ba062fd30b06814a60756f233da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT "PK_ba062fd30b06814a60756f233da" PRIMARY KEY (id);


--
-- Name: form_question_options PK_ba225d5458b4cc14448b984abac; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_question_options
    ADD CONSTRAINT "PK_ba225d5458b4cc14448b984abac" PRIMARY KEY (id);


--
-- Name: content_comments PK_c37e5a30e089d53670b0b1c36e5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_comments
    ADD CONSTRAINT "PK_c37e5a30e089d53670b0b1c36e5" PRIMARY KEY (id);


--
-- Name: form_answers PK_c52f7d73b7cd03332ba47dca123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_answers
    ADD CONSTRAINT "PK_c52f7d73b7cd03332ba47dca123" PRIMARY KEY (id);


--
-- Name: plate_comments PK_e8c11b38a10d4fda0f52117b1f6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plate_comments
    ADD CONSTRAINT "PK_e8c11b38a10d4fda0f52117b1f6" PRIMARY KEY (id);


--
-- Name: activities UQ_762e49596d3c8e3f8733e0fa7f8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT "UQ_762e49596d3c8e3f8733e0fa7f8" UNIQUE ("formId");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: IDX_0a28258fd41bf15d63873b1792; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_0a28258fd41bf15d63873b1792" ON public.content_teachers USING btree ("teacherId");


--
-- Name: IDX_5520870594c8949070196da3ad; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5520870594c8949070196da3ad" ON public.user_assigned_languages USING btree ("userId");


--
-- Name: IDX_6a7ef0363ffeeb573a7effe837; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6a7ef0363ffeeb573a7effe837" ON public.content_teachers USING btree ("contentId");


--
-- Name: IDX_71b4a202cc8a050609dc8e7ad3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_71b4a202cc8a050609dc8e7ad3" ON public.user_assigned_languages USING btree ("languageId");


--
-- Name: IDX_ed671c70a5daeca6bbffdcf31c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_ed671c70a5daeca6bbffdcf31c" ON public.user_progress USING btree ("userId", "contentId");


--
-- Name: forms FK_08f0ffcce17394ec4aafcbed2f9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT "FK_08f0ffcce17394ec4aafcbed2f9" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: content_teachers FK_0a28258fd41bf15d63873b1792a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_teachers
    ADD CONSTRAINT "FK_0a28258fd41bf15d63873b1792a" FOREIGN KEY ("teacherId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_responses FK_273348ab1f1af9df94bc0df253c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses
    ADD CONSTRAINT "FK_273348ab1f1af9df94bc0df253c" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: content_comments FK_3b7a59f47df0b7facdf400c5a2a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_comments
    ADD CONSTRAINT "FK_3b7a59f47df0b7facdf400c5a2a" FOREIGN KEY ("contentId") REFERENCES public.contents(id) ON DELETE CASCADE;


--
-- Name: contents FK_43369aa62d40ed47e303ed95432; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "FK_43369aa62d40ed47e303ed95432" FOREIGN KEY ("skillId") REFERENCES public.skills(id);


--
-- Name: content_comments FK_4a3469cba32f2dd9712821285e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_comments
    ADD CONSTRAINT "FK_4a3469cba32f2dd9712821285e5" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_assigned_languages FK_5520870594c8949070196da3ad7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_assigned_languages
    ADD CONSTRAINT "FK_5520870594c8949070196da3ad7" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: form_answers FK_62190cf83ebd77895b9bfddfe86; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_answers
    ADD CONSTRAINT "FK_62190cf83ebd77895b9bfddfe86" FOREIGN KEY ("questionId") REFERENCES public.form_questions(id) ON DELETE CASCADE;


--
-- Name: content_teachers FK_6a7ef0363ffeeb573a7effe837f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_teachers
    ADD CONSTRAINT "FK_6a7ef0363ffeeb573a7effe837f" FOREIGN KEY ("contentId") REFERENCES public.contents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_activity_history FK_6b916834e21922d3ebb2bfc0db5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activity_history
    ADD CONSTRAINT "FK_6b916834e21922d3ebb2bfc0db5" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_assigned_languages FK_71b4a202cc8a050609dc8e7ad3b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_assigned_languages
    ADD CONSTRAINT "FK_71b4a202cc8a050609dc8e7ad3b" FOREIGN KEY ("languageId") REFERENCES public.lenguages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plate_comments FK_7292f50b0f6efd4f144c18ddd72; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plate_comments
    ADD CONSTRAINT "FK_7292f50b0f6efd4f144c18ddd72" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: activities FK_762e49596d3c8e3f8733e0fa7f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT "FK_762e49596d3c8e3f8733e0fa7f8" FOREIGN KEY ("formId") REFERENCES public.forms(id) ON DELETE SET NULL;


--
-- Name: plate_comments FK_7f5ade341af9c60dc105cfaf920; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plate_comments
    ADD CONSTRAINT "FK_7f5ade341af9c60dc105cfaf920" FOREIGN KEY ("contentId") REFERENCES public.contents(id) ON DELETE CASCADE;


--
-- Name: form_answers FK_8a93549526f1be39e45a93d0a23; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_answers
    ADD CONSTRAINT "FK_8a93549526f1be39e45a93d0a23" FOREIGN KEY ("responseId") REFERENCES public.form_responses(id) ON DELETE CASCADE;


--
-- Name: form_responses FK_8e9a32f15bd2485ea908787b634; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_responses
    ADD CONSTRAINT "FK_8e9a32f15bd2485ea908787b634" FOREIGN KEY ("formId") REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: contents FK_aa89c4c21aaa5b89bb00cc3dcd7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "FK_aa89c4c21aaa5b89bb00cc3dcd7" FOREIGN KEY ("levelId") REFERENCES public.levels(id);


--
-- Name: forms FK_b53e8c7967f93bdae0280392983; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forms
    ADD CONSTRAINT "FK_b53e8c7967f93bdae0280392983" FOREIGN KEY ("contentId") REFERENCES public.contents(id) ON DELETE CASCADE;


--
-- Name: user_progress FK_b5d0e1b57bc6c761fb49e79bf89; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT "FK_b5d0e1b57bc6c761fb49e79bf89" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: skills FK_b5d8d8621106f2ca4bbe5079591; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT "FK_b5d8d8621106f2ca4bbe5079591" FOREIGN KEY ("lenguageId") REFERENCES public.lenguages(id);


--
-- Name: form_questions FK_c5db27e902da65a144f65ef1c1c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_questions
    ADD CONSTRAINT "FK_c5db27e902da65a144f65ef1c1c" FOREIGN KEY ("formId") REFERENCES public.forms(id) ON DELETE CASCADE;


--
-- Name: skills FK_cad5a64685c1be599c10bb7fc7b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT "FK_cad5a64685c1be599c10bb7fc7b" FOREIGN KEY ("levelId") REFERENCES public.levels(id);


--
-- Name: users FK_da6f4b7b21f0e7d76533beae661; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_da6f4b7b21f0e7d76533beae661" FOREIGN KEY ("assignedLanguageId") REFERENCES public.lenguages(id);


--
-- Name: users FK_df00e7cf13b1ccac576f6e55583; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_df00e7cf13b1ccac576f6e55583" FOREIGN KEY ("lastUpdateBy") REFERENCES public.users(id);


--
-- Name: form_question_options FK_e1476a302a775a6cb992f57d52f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_question_options
    ADD CONSTRAINT "FK_e1476a302a775a6cb992f57d52f" FOREIGN KEY ("questionId") REFERENCES public.form_questions(id) ON DELETE CASCADE;


--
-- Name: levels FK_e26233ab486e99ff0b5cfbdecf1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT "FK_e26233ab486e99ff0b5cfbdecf1" FOREIGN KEY ("lenguageId") REFERENCES public.lenguages(id);


--
-- Name: user_progress FK_e3c495b43c64ba9f0c41c6d543e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT "FK_e3c495b43c64ba9f0c41c6d543e" FOREIGN KEY ("contentId") REFERENCES public.contents(id) ON DELETE CASCADE;


--
-- Name: contents FK_ed30ad1fb138f8a39423def926f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "FK_ed30ad1fb138f8a39423def926f" FOREIGN KEY ("languageId") REFERENCES public.lenguages(id);


--
-- Name: user_activity_history FK_f36b4336ed7a514b5af64ec9363; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activity_history
    ADD CONSTRAINT "FK_f36b4336ed7a514b5af64ec9363" FOREIGN KEY ("activityId") REFERENCES public.activities(id) ON DELETE CASCADE;


--
-- Name: user_activity_history FK_f77a5bd1ef2d155475a539eb375; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activity_history
    ADD CONSTRAINT "FK_f77a5bd1ef2d155475a539eb375" FOREIGN KEY ("contentId") REFERENCES public.contents(id) ON DELETE CASCADE;


--
-- Name: user_activity_history FK_fcb6ec7020e048285b4f11913cb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activity_history
    ADD CONSTRAINT "FK_fcb6ec7020e048285b4f11913cb" FOREIGN KEY ("formResponseId") REFERENCES public.form_responses(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

