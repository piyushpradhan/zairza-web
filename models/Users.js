const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ValidRegNos = require("./ValidRegNos")
const ThirdPartyProviderSchema = require("./ThirdPartyAuth");


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      index:true
    },
    email_is_verified: {
      type: Boolean,
      default: false,
    },
    registration_no: {
      type: Number,
      unique: true,
      sparse: true,
    },
    year: {
      type:Number,
      enum: [1,2,3,4,5]
    },
    password: {
      type: String,
    },
    third_party_auth: [ThirdPartyProviderSchema],
    newsletter_subscription: {
      applied: { type: Boolean, default: false },
      applied_at: Date,
    },
  },
  {
    strict: true,
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// checking if registration no is valid
UserSchema.methods.checkValidRegistrationNo = function (registration_no) {
  // TODO: to be done
  return true;
}

module.exports = User = mongoose.model("users", UserSchema);
