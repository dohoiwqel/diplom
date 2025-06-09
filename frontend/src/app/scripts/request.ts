import axios, { AxiosError, AxiosRequestConfig } from 'axios'

class SafeRequest {
    async get(url: string, axiosRequestConfig?: AxiosRequestConfig<any>) {
        try {
            return await axios.get(url, axiosRequestConfig)

        } catch(e: any) {
            if (e instanceof AxiosError) {
                alert(JSON.stringify(e.response?.data || e.message))
            } else {
                alert(JSON.stringify(e))
            }
            console.error(JSON.stringify(e))

        }
    }

    async post(url: string, data?: any, config?: AxiosRequestConfig<any>) {
        try {
            return await axios.post(url, data, config)

        } catch(e: any) {
            if (e instanceof AxiosError) {
                alert(JSON.stringify(e.response?.data || e.message))
            } else {
                alert(JSON.stringify(e))
            }
            console.error(JSON.stringify(e))

        }
    }
}

const safeRequest = new SafeRequest()

export default safeRequest