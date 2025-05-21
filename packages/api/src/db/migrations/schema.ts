import { pgTable, foreignKey, bigint, date, text, timestamp, pgPolicy, varchar, serial, numeric, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const careActivities = pgTable("care_activities", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "care_activities_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	date: date(),
	activityContent: text("activity_content"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	duration: bigint({ mode: "number" }),
	problem: text(),
	emotion: text(),
	result: text(),
	resumeSummary: text("resume_summary"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	solution: text(),
	title: text(),
	starStatement: text("star_statement"),
	summary: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "care_activities_user_id_fkey"
		}),
]);

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "user_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: varchar().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	email: text().notNull(),
}, (table) => [
	pgPolicy("テスト用", { as: "permissive", for: "select", to: ["anon"], using: sql`true` }),
]);

export const activitySkills = pgTable("activity_skills", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "activity_skills_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	activityId: bigint("activity_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	skillId: bigint("skill_id", { mode: "number" }),
	relevance: text(),
	reason: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityId],
			foreignColumns: [careActivities.id],
			name: "activity_skills_activity_id_fkey"
		}),
	foreignKey({
			columns: [table.skillId],
			foreignColumns: [skills.id],
			name: "activity_skills_skill_id_fkey"
		}),
]);

export const bizEquivalents = pgTable("biz_equivalents", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "biz_equivalents_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	careSkill: text("care_skill"),
	bizEquivalent: text("biz_equivalent"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	skillId: bigint("skill_id", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.skillId],
			foreignColumns: [skills.id],
			name: "biz_equivalents_skill_id_fkey"
		}),
]);

export const skills = pgTable("skills", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "skills_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	count: bigint({ mode: "number" }),
	description: text(),
	icon: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	tendency: text().default('まれに見られる'),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "skills_user_id_fkey"
		}),
]);

export const careActivityCandidates = pgTable("care_activity_candidates", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id", { length: 36 }).notNull(),
	rawTitle: text("raw_title").notNull(),
	rawStart: timestamp("raw_start", { withTimezone: true, mode: 'string' }).notNull(),
	rawEnd: timestamp("raw_end", { withTimezone: true, mode: 'string' }).notNull(),
	score: numeric(),
	extractedJson: jsonb("extracted_json"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});
