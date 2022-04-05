const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const mongoose = require('mongoose')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error');


class UserService {
    async registration(username, password, todos) {
        const candidate = await UserModel.findOne({ username })
        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким именем уже существует')
        }
        const hashPassword = await bcrypt.hashSync(password, 3)
        const user = await UserModel.create({ username, password: hashPassword, _id: mongoose.Types.ObjectId()}, todos)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async login(username, password) {
        const user = await UserModel.findOne({ username })
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с таким ${username} не найден`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto }
    }

    async deleteAcc(username, refreshToken) {
        const userData = await UserModel.deleteOne({ username })
        const token = await tokenService.removeToken(refreshToken);
        return [userData, token];
    }
}

module.exports = new UserService();