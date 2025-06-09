import { Module } from "@nestjs/common";
import { PriceService } from "./price.service";
import { PriceController } from "./price.controller";
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [PriceService],
    controllers: [PriceController],
})
export class PriceModule {
    
}