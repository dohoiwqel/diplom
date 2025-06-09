import { Module } from "@nestjs/common";
import { BalanceModule } from "./balance/balance.module";
import { PriceModule } from "./price/price.module";
import { AuthUserModule } from "./authUser/authUser.module";
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import * as memoryStore from 'cache-manager-memory-store';
import { HistoryModule } from "./history/history.module";
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from "./file/file.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path'

@Module({
    imports: [
        BalanceModule, 
        PriceModule, 
        AuthUserModule,
        HistoryModule,
        FileModule,

        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
        CacheModule.register({
            isGlobal: true,
            ttl: 0,
            store: memoryStore.default
        }),
        ScheduleModule.forRoot(),
        HttpModule,
        MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.xrwtd0u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    ],

})
export class AppModule {}