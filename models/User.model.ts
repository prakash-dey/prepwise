import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  profileURL?: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileURL: {
      type: String,
      default: 'https://www.gravatar.com/avatar/?d=mp',
    },
  },
  {
    timestamps: true,
  }
);


UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};
 
UserSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET || 'yoursecretkey',
    { expiresIn: '1h' }
  );
  return token;
};


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
