import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const signUpBodyValidation = (body) => {
  const schema = Joi.object({
    userName: Joi.string().required().label("User Name"),
    password: passwordComplexity().required().label("Password"),
    department: Joi.number().required().label("Department"),
  });
  return schema.validate(body);
};

export const logInBodyValidation = (body) => {
  const schema = Joi.object({
    userName: Joi.string().required().label("User Name"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

export const refreshTokenBodyValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
    userId: Joi.number().required().label("User id"),
  });
  return schema.validate(body);
};