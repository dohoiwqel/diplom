import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ethers } from "ethers";
import { Model } from "mongoose";
import { User, UserDocument } from "src/schemas/user.schemas";
import { RegisterUserDto } from "./dto";
import { FileService } from "src/file/file.service";


@Injectable()
export class AuthUserService {
    
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private fileService: FileService
    ) {}

    async register(userData: RegisterUserDto, file: any | null) {
        console.log(file)
        if(file) {
            const avatarPath = this.fileService.createFile(file);
            const user = await this.UserModel.create({...userData, avatar: avatarPath})
            return user

        } else {
            const user = await this.UserModel.create({...userData})
            return user
        }

    }

    async getByWalletAddress(address: string) {
        const user = await this.UserModel.findOne({ walletAddress: address });
        return user;
    }

    async getByAlias(alias: string) {
        const user = await this.UserModel.findOne({ alias: alias });
        return user;
    }

    async getAll() {
        const allUsersData = await this.UserModel.find()
        return allUsersData 
    }

    async deleteAll() {
        const deletedData = await this.UserModel.deleteMany({})
        return deletedData
    }

    async changeUserData(userData: RegisterUserDto, file: any | null) {

        if(file) {
            const avatarPath = this.fileService.createFile(file);
            const updatedData = await this.UserModel.updateOne(
                {walletAddress: userData.walletAddress},
                {$set: {email: userData.email, alias: userData.alias, avatar: avatarPath}}
            )
            const newUserData = await this.getByWalletAddress(userData.walletAddress)
            return newUserData
        } else {
            const updatedData = await this.UserModel.updateOne(
                {walletAddress: userData.walletAddress},
                {$set: {email: userData.email, alias: userData.alias}}
            )
            
            const newUserData = await this.getByWalletAddress(userData.walletAddress)
            return newUserData
        }


    }

    async verifySignature(
        {address, signature, message}:
        { address: string, signature: string, message: string }
    ): Promise<{verified: boolean}> {
        const recoveredAddress = ethers.verifyMessage(message, signature);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
            return { verified: true };
        } else {
            throw {verified: false}
        }
    }
}