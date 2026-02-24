import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const normalizeRole = (value) => {
  if (typeof value !== "string") {
    return "user";
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "admin" ? "admin" : "user";
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false 
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      set: normalizeRole
    },
    tokens: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

});

export default mongoose.models.User || mongoose.model("User", userSchema);
