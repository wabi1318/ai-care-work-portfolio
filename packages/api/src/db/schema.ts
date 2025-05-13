import {
  pgTable,
  pgPolicy,
  bigint,
  varchar,
  timestamp,
  text,
  foreignKey,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "user_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: "9223372036854775807",
      cache: 1,
    }),
    name: varchar().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    email: text().notNull(),
  },
  (table) => [
    pgPolicy("テスト用", {
      as: "permissive",
      for: "select",
      to: ["anon"],
      using: sql`true`,
    }),
  ]
);

export const skills = pgTable("skills", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "skills_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: "9223372036854775807",
    cache: 1,
  }),
  name: text(),
  category: text(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  count: bigint({ mode: "number" }),
  // 追加フィールド
  description: text(), // スキルの説明文
  icon: text(), // アイコン名（例: "BarChart2"）
  color: text(), // カラー名（例: "rose"）
  score: bigint({ mode: "number" }), // 内部スコア（0-100）
});

export const careActivities = pgTable(
  "care_activities",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "care_activities_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: "9223372036854775807",
      cache: 1,
    }),
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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    solution: text(),
    // エピソードとハイライトの統合に対応するフィールド追加
    title: text(), // 活動タイトル
    summary: text(), // 活動の概要
    starStatement: text("star_statement"), // STAR形式のエピソード
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "care_activities_user_id_fkey",
    }),
  ]
);

export const activitySkills = pgTable(
  "activity_skills",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "activity_skills_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: "9223372036854775807",
      cache: 1,
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    activityId: bigint("activity_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    skillId: bigint("skill_id", { mode: "number" }),
    tendency: text(), // 発揮傾向（まれに見られる、少し見られる、よく見られる、強く見られる）
    relevance: text(), // 関連性（高い、中程度）
    reason: text(), // 根拠となる説明
    source: text(), // データソース
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.activityId],
      foreignColumns: [careActivities.id],
      name: "activity_skills_activity_id_fkey",
    }),
    foreignKey({
      columns: [table.skillId],
      foreignColumns: [skills.id],
      name: "activity_skills_skill_id_fkey",
    }),
  ]
);

// ビジネス等価スキルのマッピングテーブル
export const bizEquivalents = pgTable(
  "biz_equivalents",
  {
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "biz_equivalents_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: "9223372036854775807",
      cache: 1,
    }),
    careSkill: text("care_skill"), // ケアスキル名
    bizEquivalent: text("biz_equivalent"), // ビジネス等価スキル名
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    skillId: bigint("skill_id", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.skillId],
      foreignColumns: [skills.id],
      name: "biz_equivalents_skill_id_fkey",
    }),
  ]
);
