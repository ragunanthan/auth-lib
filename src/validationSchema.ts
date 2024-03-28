import Joi, { ObjectSchema } from "joi";
import passwordComplexity from "joi-password-complexity";

interface SignUpBody {
  userName: string;
  password: string;
  department: number;
}

interface LogInBody {
  userName: string;
  password: string;
}

interface RefreshTokenBody {
  refreshToken: string;
  userId: number;
}

export const signUpBodyValidation = (body: SignUpBody): Joi.ValidationResult => {
  const schema: ObjectSchema<SignUpBody> = Joi.object({
    userName: Joi.string().required().label("User Name"),
    password: passwordComplexity().required().label("Password"),
    department: Joi.number().required().label("Department"),
  });
  return schema.validate(body);
};

export const logInBodyValidation = (body: LogInBody): Joi.ValidationResult => {
  const schema: ObjectSchema<LogInBody> = Joi.object({
    userName: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

export const refreshTokenBodyValidation = (body: RefreshTokenBody): Joi.ValidationResult => {
  const schema: ObjectSchema<RefreshTokenBody> = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
    userId: Joi.number().required().label("User id"),
  });
  return schema.validate(body);
};
