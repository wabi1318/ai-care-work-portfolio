import { relations } from "drizzle-orm/relations";
import { users, careActivities, activitySkills, skills, bizEquivalents } from "./schema";

export const careActivitiesRelations = relations(careActivities, ({one, many}) => ({
	user: one(users, {
		fields: [careActivities.userId],
		references: [users.id]
	}),
	activitySkills: many(activitySkills),
}));

export const usersRelations = relations(users, ({many}) => ({
	careActivities: many(careActivities),
}));

export const activitySkillsRelations = relations(activitySkills, ({one}) => ({
	careActivity: one(careActivities, {
		fields: [activitySkills.activityId],
		references: [careActivities.id]
	}),
	skill: one(skills, {
		fields: [activitySkills.skillId],
		references: [skills.id]
	}),
}));

export const skillsRelations = relations(skills, ({many}) => ({
	activitySkills: many(activitySkills),
	bizEquivalents: many(bizEquivalents),
}));

export const bizEquivalentsRelations = relations(bizEquivalents, ({one}) => ({
	skill: one(skills, {
		fields: [bizEquivalents.skillId],
		references: [skills.id]
	}),
}));