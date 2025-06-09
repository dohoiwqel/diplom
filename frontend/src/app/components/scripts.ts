import { isAddress } from "ethers";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getUserByAlias } from "../scripts/backendAPI";

export async function handleSearch(router: AppRouterInstance, addressOrAlias: string | null | undefined) {
    if (!addressOrAlias) {
        alert("Введите адрес");
        return;
    }

    if(addressOrAlias.startsWith('0x')) {
      if(isAddress(addressOrAlias)) {
          router.push(`/profile/${addressOrAlias}`);
      } else {
          alert("Неверный формат адреса");
      }
    
    } else {
      //поиск по псевдониму
      const userData = await getUserByAlias(addressOrAlias)

      if(userData) {
        router.push(`/profile/${userData.walletAddress}`)
      }
    }
}