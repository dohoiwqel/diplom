"use client"

import React from "react";
import safeRequest from "../scripts/request";
import { BACKEND_URL } from "../constants";

export default function Profile() {

    async function getAccountBalance() {
        console.log(BACKEND_URL)
        const response = await safeRequest.get(`${BACKEND_URL}/balance`)
        alert(JSON.stringify(response))
    }

    return (
        <div className="pt-[30vh]">
            <button
                onClick={getAccountBalance}
                className="cursor-pointer"
            >
            qwe
            </button>
        </div>
    )
}
