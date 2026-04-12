import Skill from "../models/Skill.js";

export const getAllSkills = async () => {
  return await Skill.find();
};

export const getSkillById = async (id) => {
  return await Skill.findById(id);
};

export const createSkill = async (skillData) => {
  return await Skill.create({ ...skillData, status: "pending" });
};

export const updateSkill = async (id, updateData) => {
  return await Skill.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteSkill = async (id) => {
  const result = await Skill.findByIdAndDelete(id);
  if (!result) throw new Error("Skill not found");
  return { message: "Skill deleted successfully" };
};

export const approveSkill = async (id) => {
  const skill = await Skill.findById(id);
  if (!skill) throw new Error("Skill not found");
  skill.status = "approved";
  await skill.save();
  return skill;
};

export const rejectSkill = async (id) => {
  const skill = await Skill.findById(id);
  if (!skill) throw new Error("Skill not found");
  skill.status = "rejected";
  await skill.save();
  return skill;
};

export const getPendingSkills = async () => {
  return await Skill.find({ status: "pending" });
};

export const getApprovedSkills = async () => {
  return await Skill.find({ status: "approved" });
};
