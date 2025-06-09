import { BACKEND_URL } from "../constants";
import { TokenName, NativeName, BalanceData, PriceData, TokenTransferResponse, TokenTransfer, ExplorerTokenTransfer, RegisterUserDto, ExistUserData } from "../types/backendTypes";
import { TotalBalanceResponse } from "../types/types";
import safeRequest from "./request";

export async function getTotalBalance(address: string): Promise<TotalBalanceResponse| undefined> {
    const response = await safeRequest.get(`${BACKEND_URL}/api/balance/${address}`);
    return response?.data
}

export async function getAuthMessage(address: string): Promise<string> {
    const response = await safeRequest.get(`${BACKEND_URL}/api/auth/nonce/${address}`)
    return response?.data
}

export async function verifySignature(address: string, signature: string, message: string): Promise<{verified: boolean}> {
    const response = await safeRequest.post(`${BACKEND_URL}/api/auth/verify-signature`,
        {
            address: address,
            signature: signature,
            message: message
        }
    )
    return response?.data
}

export async function getPrices(): Promise<PriceData> {
    const response = await safeRequest.get(`${BACKEND_URL}/api/prices`)
    return response?.data
}

export async function getHistory(address: string): Promise<ExplorerTokenTransfer[]> {
    const response = await safeRequest.get(`${BACKEND_URL}/api/history/${address}`)
    return response?.data
}

// БД

export async function registerUser(data: RegisterUserDto): Promise<ExistUserData> {
    const formData = new FormData();

    formData.append('walletAddress', data.walletAddress);
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    formData.append('email', data.email);
    if (data.alias) formData.append('alias', data.alias);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        body: formData,
    });

    return await response.json();
}

export async function getUserByWalletAddress(address: string): Promise<ExistUserData | null> {
    const response = await safeRequest.get(`${BACKEND_URL}/api/auth/getUserByAddress?address=${address}`)
    if(response?.data) {
        return response.data
    } else {
        return null
    }
}

export async function changeUserData(data: RegisterUserDto) {
    const formData = new FormData();

    formData.append('walletAddress', data.walletAddress);
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    formData.append('email', data.email);
    if (data.alias) formData.append('alias', data.alias);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await fetch(`${BACKEND_URL}/api/auth/changeUserData`, {
        method: 'PATCH',
        body: formData,
    });

    return await response.json();
}

export async function getUserByAlias(alias: string): Promise<RegisterUserDto> {
    const response = await safeRequest.get(`${BACKEND_URL}/api/auth/getUserByAlias/${alias}`)
    return response?.data
}