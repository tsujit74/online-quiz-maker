
import bcrypt from "bcryptjs";
import mongoose, { Schema, Document } from "mongoose";

// --- User Model Definition ---
// This part should be in a separate file (e.g., ../models/User.ts)
// but is included here for a complete, self-contained example.

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving a new user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Custom method to compare the entered password with the hashed password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);