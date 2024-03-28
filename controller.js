import bcrypt from "bcrypt";

import {
  signUpBodyValidation,
  logInBodyValidation,
} from "./validationSchema.js";


const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "14m",
    });
  };
  
  const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d",
    });
  };

const signUp = ({        
    getUser,
    saveUser}) => async (req, res) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ isSuccess : false, message: error.details[0].message });

    const { success } = await getUser("username" ,req.body.userName);
    if (success)
      return res
        .status(400)
        .json({ isSuccess : false, message: "User is already exist" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const { success: saved } = await saveUser(
      req.body.userName,
      hashPassword,
      req.body.department
    );
    if (saved)
      res.status(201).json({
        isSuccess : true,
        message: "Account created sucessfully",
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ isSuccess : false, message: "Internal Server Error" });
  }
};

const generateTokens = async (userData, addToken) => {
  try {
    const payload = { _id: userData.id, department_id : userData.department_id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await addToken(userData.id, refreshToken);
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

const login = ({getUser,addToken }) => async (req, res) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({ isSuccess : false, message: error.details[0].message });

    const { success, user } = await getUser("username", req.body.userName);
    if (!success)
      return res.status(401).json({ isSuccess : false, message: "Invalid Username" });
    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword)
      return res.status(401).json({ isSuccess : false, message: "Invalid password" });
    const { accessToken, refreshToken } = await generateTokens(user, addToken);
    res.status(200).json({
      isSuccess : true,
      message: "Logged in sucessfully",
      data: {
        accessToken,
        refreshToken,
        username: user.username,
        department_id : user.department_id,
        forms : user.forms
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ isSuccess : false, message: "Internal Server Error" });
  }
};

const logout = ({deleteExistingToken}) => async (req, res) => {
  try {
    let deleted = await deleteExistingToken(req.user._id);
    if (deleted)
      res.status(200).json({ isSuccess : true, message: "Logged Out Sucessfully" });
    else res.status(500).json({ isSuccess : false, message: "Error while logout" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ isSuccess : false, message: "Internal Server Error" });
  }
};

const verifyRefreshToken = (userId, refreshToken, getToken) => {
  return new Promise(async (resolve, reject) => {
    const { success, token } = await getToken(userId);

    if (!success)
      return reject({ isSuccess : false, message: "Invalid refresh token" });
    if (token.trim() !== refreshToken.trim()) return reject({ isSuccess : false, message: "Same user is logged in other device, please login again." });
    return resolve({
        isSuccess : true,
        message: "Valid refresh token",
      });
  });
};

const refreshToken = ({ getToken }) => async (req, res) => {

  verifyRefreshToken(req.user._id, req?.headers?.authorization?.split(' ')[1], getToken)
    .then(async () => {
      const payload = {_id: req.user._id, department_id: req.user.department_id };
      const accessToken = generateAccessToken(payload);
      res.status(200).json({
        isSuccess : true,
        accessToken,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(500).json({
      isSuccess : false,
      message: err.message,
    }));
};

const getUserDetail = ({getUser}) => async  (req, res) => { 
  let { _id } = req.user;
  const { success, user } = await getUser("id" , _id);
  if(success) res.status(200).json({
    isSuccess : true,
    data : {
      department_id : user.department_id,
      forms : user.forms
    }
  });
  else res.status(500).json({
    isSuccess : false,
    message : "Internal server error"
  });
}
export { signUp, login, logout, refreshToken, getUserDetail };
