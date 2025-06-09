import { Module } from "@nestjs/common";
import { AuthUserController } from "./authUser.controller";
import { AuthUserService } from "./authUser.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schemas";
import { FileService } from "src/file/file.service";


@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    controllers: [AuthUserController],
    providers: [AuthUserService, FileService]
})
export class AuthUserModule {

}