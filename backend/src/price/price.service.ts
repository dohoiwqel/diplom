import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable() 
export class PriceService {

    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
        private readonly axios: HttpService,
    ) {}

    private readonly url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,ethereum,tether,usd-coin&vs_currencies=usd,rub';

    async fetchPrices() {
        const { data } = await firstValueFrom(this.axios.get(this.url));
        return data;
    }

    async getPrices() {
        const cached = await this.cache.get('tokenPrices');
        if (cached) {
            return cached
        }

        const data = await this.fetchPrices();
        await this.cache.set('tokenPrices', data);
        return data;
    }

    @Cron('0 * * * * *')
    async refreshPrices() {
        const data = await this.fetchPrices();
        await this.cache.set('tokenPrices', data);
    }
}