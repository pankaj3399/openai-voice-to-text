import bcrypt from 'bcryptjs';
import User from "../../models/userSchema.js";
import httpStatus from "http-status";
import sendResponse from "../../../utils/helpers/SendResponse.js";
import catchAsync from "../../../utils/helpers/catchAsync.js";
import ApiError from "../../../utils/errors/ApiError.js";
import generateToken from "../../../utils/helpers/jwt/generateToken.js";

const signin = catchAsync(
    async (req, res) => {

        // checking username and password given
        if (!req.body.username || !req.body.password) throw new ApiError(httpStatus.BAD_REQUEST, 'Fields are not there!');

        // find user
        const user = await User.findOne({ username: req.body.username }).lean();
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Information mismatched!');

        // checking is valid password
        const isValidPassword = await bcrypt.compareSync(req.body.password, user.password);
        if (!isValidPassword) throw new ApiError(httpStatus.UNAUTHORIZED, 'Credential mismatch!');

        // token
        const token = generateToken(user, false);

        // user data
        const { password, ...pwd } = user;

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Login Success!',
            data: {
                accessToken: token,
                user: pwd
            },
        });
    }
)

export default signin