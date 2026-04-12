import test from "node:test";
import assert from "node:assert/strict";

// ======================================================
// MOCK SETUP (MUST BE BEFORE SERVICE IMPORT)
// ======================================================

import Skill from "../src/models/Skill.js";

// ---------- MOCK Mongoose Model Methods ----------

Skill.find = async () => {
  return [
    { _id: "1", name: "JavaScript", level: "Intermediate", status: "approved" },
    { _id: "2", name: "React", level: "Advanced", status: "pending" },
    { _id: "3", name: "Node.js", level: "Intermediate", status: "approved" }
  ];
};

Skill.findById = async (id) => {
  if (id === "1") {
    return { 
      _id: "1", 
      name: "JavaScript", 
      level: "Intermediate", 
      status: "pending",
      save: async function() { 
        this.status = this.status; 
        return this; 
      }
    };
  }
  if (id === "2") {
    return { 
      _id: "2", 
      name: "React", 
      level: "Advanced", 
      status: "pending",
      save: async function() { 
        this.status = this.status; 
        return this; 
      }
    };
  }
  return null;
};

Skill.create = async (data) => {
  return { _id: "new-id", ...data, status: "pending" };
};

Skill.findByIdAndUpdate = async (id, data) => {
  if (id === "1") {
    return { _id: id, ...data };
  }
  return null;
};

Skill.findByIdAndDelete = async (id) => {
  if (id === "1") {
    return { _id: id };
  }
  return null;
};

// ======================================================
// IMPORT SERVICE AFTER MOCKS
// ======================================================

import * as skillService from "../src/services/skill.service.js";

// ======================================================
// SKILL SERVICE TESTS
// ======================================================

// ---------------- GET ALL SKILLS ----------------
test("getAllSkills should return array of skills", async () => {
  const skills = await skillService.getAllSkills();
  
  assert.equal(Array.isArray(skills), true);
  assert.equal(skills.length, 3);
  assert.equal(skills[0].name, "JavaScript");
});

// ---------------- GET SKILL BY ID ----------------
test("getSkillById should return skill when found", async () => {
  const skill = await skillService.getSkillById("1");
  
  assert.equal(skill._id, "1");
  assert.equal(skill.name, "JavaScript");
});

test("getSkillById should return null when not found", async () => {
  const skill = await skillService.getSkillById("999");
  
  assert.equal(skill, null);
});

// ---------------- CREATE SKILL ----------------
test("createSkill should create new skill with pending status", async () => {
  const skillData = {
    name: "Python",
    level: "Beginner",
    description: "Python programming language"
  };
  
  const skill = await skillService.createSkill(skillData);
  
  assert.equal(skill.name, "Python");
  assert.equal(skill.level, "Beginner");
  assert.equal(skill.status, "pending");
  assert.ok(skill._id);
});

// ---------------- UPDATE SKILL ----------------
test("updateSkill should update skill data", async () => {
  const updateData = {
    name: "JavaScript Advanced",
    level: "Advanced"
  };
  
  const updated = await skillService.updateSkill("1", updateData);
  
  assert.equal(updated.name, "JavaScript Advanced");
  assert.equal(updated.level, "Advanced");
});

test("updateSkill should return null for non-existent skill", async () => {
  const updated = await skillService.updateSkill("999", { name: "Test" });
  
  assert.equal(updated, null);
});

// ---------------- DELETE SKILL ----------------
test("deleteSkill should remove skill", async () => {
  const result = await skillService.deleteSkill("1");
  
  assert.equal(result.message, "Skill deleted successfully");
});

test("deleteSkill should return error for non-existent skill", async () => {
  await assert.rejects(async () => {
    await skillService.deleteSkill("999");
  }, /Skill not found/);
});

// ---------------- APPROVE SKILL ----------------
test("approveSkill should change status to approved", async () => {
  const skill = await skillService.approveSkill("2");
  
  assert.equal(skill.status, "approved");
});

test("approveSkill should return error for non-existent skill", async () => {
  await assert.rejects(async () => {
    await skillService.approveSkill("999");
  }, /Skill not found/);
});

// ---------------- REJECT SKILL ----------------
test("rejectSkill should change status to rejected", async () => {
  const skill = await skillService.rejectSkill("2");
  
  assert.equal(skill.status, "rejected");
});

// ---------------- GET PENDING SKILLS ----------------
test("getPendingSkills should return only pending skills", async () => {
  // Mock to return pending skills only
  Skill.find = async () => [
    { _id: "2", name: "React", level: "Advanced", status: "pending" },
    { _id: "4", name: "Vue", level: "Intermediate", status: "pending" }
  ];
  
  const skills = await skillService.getPendingSkills();
  
  assert.equal(skills.length, 2);
  assert.equal(skills[0].status, "pending");
  assert.equal(skills[1].status, "pending");
});

// ---------------- GET APPROVED SKILLS ----------------
test("getApprovedSkills should return only approved skills", async () => {
  // Mock to return approved skills only
  Skill.find = async () => [
    { _id: "1", name: "JavaScript", level: "Intermediate", status: "approved" },
    { _id: "3", name: "Node.js", level: "Intermediate", status: "approved" }
  ];
  
  const skills = await skillService.getApprovedSkills();
  
  assert.equal(skills.length, 2);
  assert.equal(skills[0].status, "approved");
  assert.equal(skills[1].status, "approved");
});
