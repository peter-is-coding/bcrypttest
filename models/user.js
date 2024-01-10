const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username must be provided."],
    },
    password: {
        type: String,
        required: [true, "Password must be provided."],
    },
});

userSchema.statics.authenticateUser = async function (username, password) {
    const account = await this.findOne({ username });
    console.log(account);
    if (account) {
        const result = await bcrypt.compare(password, account.password);
        console.log(result);
        console.log(account._id);
        return result ? account._id : null;
    } else {
        return null;
    }
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

module.exports = mongoose.model("User", userSchema);
