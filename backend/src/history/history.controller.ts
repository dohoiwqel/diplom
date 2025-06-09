import { Controller, Get, Param, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";

@Controller('/history')
export class HistoryController {

    constructor(private historyService: HistoryService) { }

    @Get(':address')
    async getHistory(
        @Param('address') address: string,
    ) {
        return this.historyService.getHistory(address)
    }

}