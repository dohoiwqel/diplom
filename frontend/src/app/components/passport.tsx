'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ExistUserData, RegisterUserDto } from '../types/backendTypes';
import { changeUserData, getUserByWalletAddress, registerUser } from '../scripts/backendAPI';

export function Passport({ walletAddress, userData, setUserData }: {
   walletAddress: string, 
   userData: ExistUserData | null, 
   setUserData: React.Dispatch<React.SetStateAction<ExistUserData | null>> 
  }) {
  const [open, setOpen] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [formData, setFormData] = useState<RegisterUserDto>({
    walletAddress: walletAddress,
    name: '',
    surname: '',
    email: '',
    alias: '',
    avatar: null as File | null
  });

  async function register(formData: RegisterUserDto, walletAddress: string) {
    const existUser = await getUserByWalletAddress(walletAddress)

    // if (existUser === null) {
    //   const response = await registerUser({
    //     ...formData,
    //     walletAddress
    //   })
    //   alert(`Успешная регистрация`);
    // } else {
    //   setShowConfirmModal(true)
    // }

    if(existUser) {
      const response = await changeUserData({
        ...formData,
        walletAddress
      })
      setUserData(response)

    } else {
      //регистрируем пользователя
      const response = await registerUser({
        ...formData,
        walletAddress
      })
      setUserData(response)
    }
  }

  return (
    <>
      <Image
        src={userData ? "/blue-check.png" : "/passport.svg"}
        alt="Passport"
        width={28}
        height={28}
        className="object-contain h-full mr-2 cursor-pointer"
        title={userData ? "Верифицированный пользователь" : "Заполнить личные данные"}
        onClick={() => {
          console.log(userData)

          if (userData) {
            setShowConfirmModal(true)
          } else {
            setOpen(true)
          }
        }}
      />

      {/* Основная форма */}
      {open && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Личная информация</h2>
            <form
              className="flex flex-col space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                await register(formData, walletAddress)
                setOpen(false)
              }}
            >
              <input type="text" placeholder={userData? userData.name: "Имя"} required={!userData} value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!!userData}
                className={
                  userData?.name?
                  "text-blue-600 bg-gray-300 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :"border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                } />
              <input type="text" placeholder={userData? userData.surname: "Фамилия"} required={!userData} value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                disabled={!!userData}
                className={
                  userData?.surname?
                  "text-blue-600 bg-gray-300 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :"border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                } />
              <input type="email" placeholder={userData? userData.email: "Email"} required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={
                  userData?.email?
                  "text-blue-600 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :"border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                } />
              <input type="text" placeholder={userData? userData.alias: "Псевдоним"} required value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                className={
                  userData?.alias?
                  "text-blue-600 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :"border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                } />
              
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 font-medium border p-2 rounded block text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              {formData.avatar
                ? formData.avatar.name
                : userData
                  ? "Изменить аватар"
                  : "Выберите файл"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFormData({ ...formData, avatar: e.target.files?.[0] || null })
                }}
                className="hidden"
              />

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => {
                  setOpen(false)
                  setFormData({
                    ...formData,
                    name: '',
                    surname: '',
                    email: '',
                    alias: '',
                    avatar: null as File | null
                  })
                }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Закрыть</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Подтверждение */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Вы уже зарегистрированы</h2>
            <p className="text-sm mb-6 text-gray-600">
              Вы хотите изменить свои личные данные?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
              >
                Нет
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setShowConfirmModal(false)
                  setOpen(true)
                }}
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
