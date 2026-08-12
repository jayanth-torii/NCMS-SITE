const mongoose = require("mongoose");

// Per-page access grant. `page` is a page key (see admin ADMIN_PAGES config),
// `read` controls menu visibility, `write` controls save/edit ability.
const PermissionSchema = mongoose.Schema(
  {
    page: { type: String, required: true },
    read: { type: Boolean, default: false },
    write: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = mongoose.Schema(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "coo", "dean", "principal", "hod", "faculty"],
      default: "faculty",
    },
    department: { type: String, default: "" },
    Department: { type: String },
    permissions: { type: [PermissionSchema], default: [] },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    added_by: { type: String, default: "system" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
