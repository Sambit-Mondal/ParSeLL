import { z } from 'zod';

// User Schema
const UserSchema = z.object({
  username: z.string().max(10, { message: 'Username must be at most 10 characters long' }),
  name: z.string(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters long' }),
  phone: z.string().length(10, { message: 'Phone number must be 10 digits long' }),
  role: z.enum(['Seller', 'Buyer'], { message: 'Invalid role. Must be Seller or Buyer' }),
  address: z.string().optional(),
});

export default UserSchema;